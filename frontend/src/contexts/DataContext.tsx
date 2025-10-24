import React, { useContext, useState, useEffect } from 'react';
import { Project, Task, User, mockProjects, mockTasks, mockUsers } from '@/lib/mockData';
import api, { type ProjectDTO, type TaskDTO, type UserDTO } from '@/lib/api';
import { useAuth } from '@/contexts';
import DataContext, { type DataContextType } from './DataContext.context';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [recentCompletedTasks, setRecentCompletedTasks] = useState<Task[]>([]);
  const { token, user } = useAuth();
  // mapping helpers
  const mapProject = (pp: ProjectDTO): Project => {
    const leaderId = typeof pp.leaderId === 'string' ? pp.leaderId : (pp.leaderId && (pp.leaderId as { _id?: string })._id) || '';
    const memberIds = (pp.memberIds || []).map(m => (typeof m === 'string' ? m : (m as { _id?: string })._id || '')) as string[];
    return {
  id: pp._id,
  name: pp.name,
  description: pp.description || '',
  category: (pp.category as Project['category']) || 'important',
  status: pp.status === 'in-progress' ? 'in-progress' : ((pp.status as Project['status']) || 'planning'),
  leaderId,
  memberIds,
  progress: pp.progress ?? 0,
  startDate: pp.startDate || '',
  endDate: pp.endDate || '',
  color: pp.color || 'gradient-indigo',
  createdAt: ''
};
  };

  const mapTask = (tt: TaskDTO): Task => {
  const projectId = typeof tt.projectId === 'string' ? tt.projectId : (tt.projectId && (tt.projectId as ProjectDTO)._id) || '';
  const assigneeIds = (tt.assigneeIds || []).map(a => (typeof a === 'string' ? a : (a as { _id?: string })._id || '')) as string[];
  const checklist = Array.isArray(tt.checklist) ? tt.checklist as Task['checklist'] : [];
  const comments = Array.isArray(tt.comments) ? tt.comments as Task['comments'] : [];
    return {
      id: tt._id,
      title: tt.title,
      description: tt.description || '',
      projectId,
      priority: (tt.priority as Task['priority']) || 'medium',
      status: (tt.status as Task['status']) || 'todo',
      assigneeIds,
      dueDate: tt.dueDate || '',
      checklist: checklist as Task['checklist'],
      comments: comments as Task['comments'],
    };
  };

  const mapUser = (uu: UserDTO): User => ({
    id: uu._id,
    name: uu.name,
    email: uu.email,
    password: '',
    role: (uu.role as User['role']) || 'member',
    avatar: uu.avatar || (uu.name ? uu.name[0] : 'U'),
    status: 'active',
  });

  const toProjectDTO = (p: Omit<Project, 'id'>): Partial<ProjectDTO> => ({
    name: p.name,
    description: p.description,
    status: p.status === 'in-progress' ? 'in-progress' : (p.status as unknown as string),
    startDate: p.startDate,
    endDate: p.endDate,
    category: p.category,
    color: p.color,
    leaderId: p.leaderId,
    memberIds: p.memberIds,
  });

  const toTaskDTO = (t: Omit<Task, 'id'>): Partial<TaskDTO> => ({
    title: t.title,
    description: t.description,
    projectId: t.projectId,
    priority: t.priority,
    dueDate: t.dueDate,
    assigneeIds: t.assigneeIds,
    checklist: t.checklist,
    comments: t.comments,
  });

  const toUserDTO = (u: Omit<User, 'id'>): Partial<UserDTO> => ({
    name: u.name,
    email: u.email,
    role: u.role,
  });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (token) {
        try {
          // always fetch projects and tasks
          const [p, t] = await Promise.all([
            api.projects.list(token),
            api.tasks.list(token),
          ]);

          if (!mounted) return;

          setProjects(p.map(mapProject));
          const mappedTasks = t.map(mapTask);
          setTasks(mappedTasks);
          // initialize recent completed tasks from server data (take latest 5 done tasks)
          try {
            const done = mappedTasks.filter(tt => tt.status === 'done');
            // assume server returns tasks roughly in creation order; take the last 5
            setRecentCompletedTasks(done.slice(-5).reverse());
          } catch (e) {
            setRecentCompletedTasks([]);
          }

          // fetch users only if current user is admin or leader
          if (user && (user.role === 'admin' || user.role === 'leader')) {
            try {
              const u = await api.users.list(token);
              if (!mounted) return;
              setUsers(u.map(mapUser));
            } catch (err) {
              console.warn('Failed to load users list (likely insufficient role)', err);
              // for non-authorized roles keep users minimal (current user only)
              setUsers(user ? [user] : []);
            }
          } else {
            // members: show only current user (if available)
            setUsers(user ? [user] : []);
          }

          return;
        } catch (err) {
          console.error('Failed to load remote data', err);
        }
      }

      // fallback to mock/local data when not authenticated or a hard failure occurred
      setProjects(mockProjects);
      const parsedTasks = mockTasks.map((task: Task) => {
        // normalize older mock shapes
        const t = task as unknown as Record<string, unknown>;
        const assigneeId = typeof t['assigneeId'] === 'string' ? String(t['assigneeId']) : undefined;
        const assigneeIds = Array.isArray(t['assigneeIds']) ? (t['assigneeIds'] as string[]) : undefined;
        if (assigneeId && !assigneeIds) return { ...task, assigneeIds: [assigneeId] };
        if (!assigneeIds) return { ...task, assigneeIds: [] };
        return task;
      });
      setTasks(parsedTasks);
      // init recent completed tasks from mock data
      try {
        const done = parsedTasks.filter(tt => tt.status === 'done');
        setRecentCompletedTasks(done.slice(-5).reverse());
      } catch (e) {
        setRecentCompletedTasks([]);
      }
      setUsers(mockUsers);
    };
    load();
    return () => {
      mounted = false;
    };
  }, [token, user]);

  // keep local cache for offline usage (optional)
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const addProject = (project: Omit<Project, 'id'>) => {
    const create = async () => {
      if (!token) {
        const newProject = { ...project, id: `p${Date.now()}` };
        setProjects(prev => [...prev, newProject]);
        return;
      }
      try {
        const body = toProjectDTO(project);
        const res = await api.projects.create(token, body);
        // refresh authoritative projects from server (includes persisted progress)
        const remote = await api.projects.list(token);
        setProjects(remote.map(mapProject));
      } catch (err) {
        console.error('Failed to create project', err);
      }
    };
    create();
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    const apply = async () => {
      if (!token) {
        setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
        return;
      }
      try {
        await api.projects.update(token, id, updates as unknown as Partial<ProjectDTO>);
        // refresh authoritative projects from server
        const remote = await api.projects.list(token);
        setProjects(remote.map(mapProject));
      } catch (err) {
        console.error('Failed to update project', err);
      }
    };
    apply();
  };

  const deleteProject = (id: string) => {
    const apply = async () => {
      if (!token) {
        setProjects(prev => prev.filter(p => p.id !== id));
        setTasks(prev => prev.filter(t => t.projectId !== id));
        return;
      }
      try {
        await api.projects.remove(token, id);
        // refresh authoritative projects and tasks from server
        const [p, t] = await Promise.all([api.projects.list(token), api.tasks.list(token)]);
        setProjects(p.map(mapProject));
        setTasks(t.map(mapTask));
      } catch (err) {
        console.error('Failed to delete project', err);
      }
    };
    apply();
  };

  const addTask = (task: Omit<Task, 'id'>) => {
    const create = async () => {
      if (!token) {
        const newTask = { ...task, id: `t${Date.now()}` };
        setTasks(prev => [...prev, newTask]);
        return;
      }
      try {
        const body = toTaskDTO(task);
        const res = await api.tasks.create(token, body);
        // add task locally
        const created = mapTask(res);
        setTasks(prev => [...prev, created]);
        // if the created task is already 'done', add to recentCompletedTasks
        if (created.status === 'done') {
          setRecentCompletedTasks(rc => [created, ...rc].slice(0, 5));
        }
        // refresh projects to pick up server-calculated progress
        const remote = await api.projects.list(token);
        setProjects(remote.map(mapProject));
      } catch (err) {
        console.error('Failed to create task', err);
      }
    };
    create();
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    const apply = async () => {
      if (!token) {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
        return;
      }
      try {
        const res = await api.tasks.update(token, id, updates as unknown as Partial<TaskDTO>);
        const updated = mapTask(res);
        setTasks(prev => {
          const next = prev.map(t => t.id === id ? updated : t);
          // if the status changed to done, push to recentCompletedTasks
          const prevTask = prev.find(t => t.id === id);
          if (prevTask && prevTask.status !== 'done' && updated.status === 'done') {
            setRecentCompletedTasks(rc => [updated, ...rc].slice(0, 5));
          }

          return next;
        });
        // refresh authoritative projects from server (server persisted progress)
        const remote = await api.projects.list(token);
        setProjects(remote.map(mapProject));
      } catch (err) {
        console.error('Failed to update task', err);
      }
    };
    apply();
  };

  const deleteTask = (id: string) => {
    const apply = async () => {
      if (!token) {
        setTasks(prev => prev.filter(t => t.id !== id));
        return;
      }
      try {
        await api.tasks.remove(token, id);
  setTasks(prev => prev.filter(t => t.id !== id));
  // remove from recentCompletedTasks if present
  setRecentCompletedTasks(rc => rc.filter(t => t.id !== id));
  // refresh authoritative projects from server
  const remote = await api.projects.list(token);
  setProjects(remote.map(mapProject));
      } catch (err) {
        console.error('Failed to delete task', err);
      }
    };
    apply();
  };

  const addUser = (user: Omit<User, 'id'>) => {
    const create = async () => {
      if (!token) {
        const newUser = { ...user, id: `u${Date.now()}` };
        setUsers(prev => [...prev, newUser]);
        return;
      }
      try {
        const body = toUserDTO(user);
        const res = await api.users.create(token, body);
        setUsers(prev => [...prev, mapUser(res)]);
      } catch (err) {
        console.error('Failed to create user', err);
      }
    };
    create();
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    const apply = async () => {
      if (!token) {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
        return;
      }
      try {
        const res = await api.users.update(token, id, updates as unknown as Partial<UserDTO>);
        setUsers(prev => prev.map(u => u.id === id ? mapUser(res) : u));
      } catch (err) {
        console.error('Failed to update user', err);
      }
    };
    apply();
  };

  const deleteUser = (id: string) => {
    const apply = async () => {
      if (!token) {
        setUsers(prev => prev.filter(u => u.id !== id));
        return;
      }
      try {
        await api.users.remove(token, id);
        setUsers(prev => prev.filter(u => u.id !== id));
      } catch (err) {
        console.error('Failed to delete user', err);
      }
    };
    apply();
  };

  return (
    <DataContext.Provider
      value={{
        projects,
        tasks,
        users,
          recentCompletedTasks,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        deleteTask,
        addUser,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
