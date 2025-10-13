import { createContext } from 'react';
import type { Project, Task, User } from '@/lib/mockData';

export type DataContextType = {
  projects: Project[];
  tasks: Task[];
  users: User[];
  recentCompletedTasks: Task[];
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
};

export const DataContext = createContext<DataContextType | undefined>(undefined);

export default DataContext;
