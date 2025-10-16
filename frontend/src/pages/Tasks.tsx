import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useData from '@/contexts/useData';
import TaskModal from '@/components/modals/TaskModal';
import { Task } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, List, LayoutGrid, Clock, User, Search, Filter } from 'lucide-react';

const Tasks = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const projectIdFromUrl = searchParams.get('project');

  const { tasks, users, projects, updateTask } = useData();
  const [activeView, setActiveView] = useState<'list' | 'kanban'>('list');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProject, setFilterProject] = useState(projectIdFromUrl || 'all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  // Update filter when URL parameter changes
  useEffect(() => {
    if (projectIdFromUrl) {
      setFilterProject(projectIdFromUrl);
    }
  }, [projectIdFromUrl]);

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProject = filterProject === 'all' || task.projectId === filterProject;
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;

    return matchesSearch && matchesProject && matchesStatus && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-danger text-white';
      case 'high':
        return 'bg-warning text-white';
      case 'medium':
        return 'bg-primary text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'bg-success text-white';
      case 'in-progress':
        return 'bg-primary text-white';
      case 'review':
        return 'bg-warning text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const kanbanColumns = [
    { id: 'todo', title: 'To Do', gradient: 'gradient-purple' },
    { id: 'in-progress', title: 'In Progress', gradient: 'gradient-blue' },
    { id: 'review', title: 'Review', gradient: 'gradient-pink' },
    { id: 'done', title: 'Done', gradient: 'gradient-emerald' },
  ];

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (newStatus: string) => {
    if (draggedTask) {
      updateTask(draggedTask, { status: newStatus as Task['status'] });
      setDraggedTask(null);
      toast.success('Task status updated');
    }
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const selectedProjectName = projects.find(p => p.id === filterProject)?.name;

  return (
    <>
      <TaskModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedTask(undefined);
        }}
        task={selectedTask}
      />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Tasks</h1>
            <p className="text-muted-foreground">
              {filterProject !== 'all' && selectedProjectName 
                ? `Showing tasks for: ${selectedProjectName}`
                : 'Track and manage your team\'s tasks'
              }
            </p>
          </div>
          <Button 
            onClick={() => {
              setSelectedTask(undefined);
              setModalOpen(true);
            }}
            className="gradient-indigo text-white hover:scale-105 transition-transform rounded-xl shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-3xl p-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>
            </div>

            {/* Project Filter */}
            <Select 
              value={filterProject} 
              onValueChange={(value) => {
                setFilterProject(value);
                if (value === 'all') {
                  searchParams.delete('project');
                } else {
                  searchParams.set('project', value);
                }
                setSearchParams(searchParams);
              }}
            >
              <SelectTrigger className="rounded-xl">
                <Filter className="mr-2 w-4 h-4" />
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>

            {/* Priority Filter */}
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="All Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* View Toggle */}
        <Tabs value={activeView} onValueChange={(v) => setActiveView(v as 'list' | 'kanban')} className="w-full">
          <TabsList className="bg-card rounded-xl p-1 shadow-sm">
            <TabsTrigger value="list" className="rounded-lg data-[state=active]:gradient-indigo data-[state=active]:text-white">
              <List className="w-4 h-4 mr-2" />
              List View
            </TabsTrigger>
            <TabsTrigger value="kanban" className="rounded-lg data-[state=active]:gradient-indigo data-[state=active]:text-white">
              <LayoutGrid className="w-4 h-4 mr-2" />
              Kanban Board
            </TabsTrigger>
          </TabsList>

          {/* List View */}
          <TabsContent value="list" className="mt-6 space-y-3">
            <div className="bg-card rounded-3xl p-6 shadow-lg">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">No tasks found</p>
                  <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters or create a new task</p>
                </div>
              ) : (
                filteredTasks.map((task) => {
                  const assignees = users.filter(u => task.assigneeIds?.includes(u.id));
                  const project = projects.find(p => p.id === task.projectId);
                  
                  return (
                    <div
                      key={task.id}
                      onClick={() => handleEdit(task)}
                      className="bg-background rounded-2xl p-5 mb-3 last:mb-0 hover:shadow-md transition-all cursor-pointer border-l-4"
                      style={{
                        borderLeftColor:
                          task.priority === 'urgent' ? 'hsl(var(--danger))' :
                          task.priority === 'high' ? 'hsl(var(--warning))' :
                          task.priority === 'medium' ? 'hsl(var(--primary))' :
                          'hsl(var(--muted))'
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{task.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {project?.name}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <Badge className={getStatusColor(task.status)}>
                            {task.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center text-muted-foreground">
                            <User className="w-4 h-4 mr-1" />
                            <span>{assignees.map(a => a.name).join(', ') || 'Unassigned'}</span>
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </TabsContent>

          {/* Kanban View */}
          <TabsContent value="kanban" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {kanbanColumns.map((column) => {
                const columnTasks = filteredTasks.filter(t => t.status === column.id);
                
                return (
                  <div 
                    key={column.id} 
                    className="bg-card rounded-3xl p-4 shadow-lg"
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(column.id)}
                  >
                    <div className={`${column.gradient} rounded-2xl p-4 mb-4 text-white`}>
                      <h3 className="font-semibold text-lg">{column.title}</h3>
                      <p className="text-sm opacity-90">{columnTasks.length} tasks</p>
                    </div>
                    
                    <div className="space-y-3">
                      {columnTasks.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                          No tasks
                        </div>
                      ) : (
                        columnTasks.map((task) => {
                          const assignees = users.filter(u => task.assigneeIds?.includes(u.id));
                          
                          return (
                            <div
                              key={task.id}
                              draggable
                              onDragStart={() => handleDragStart(task.id)}
                              onClick={() => handleEdit(task)}
                              className="bg-background rounded-2xl p-4 hover:shadow-md transition-all cursor-move border border-border"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-semibold text-sm flex-1">{task.title}</h4>
                                <Badge className={`${getPriorityColor(task.priority)} text-xs px-2 py-0.5`}>
                                  {task.priority[0].toUpperCase()}
                                </Badge>
                              </div>
                              
                              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                                {task.description}
                              </p>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex -space-x-2">
                                  {assignees.map((assignee, idx) => (
                                    <div key={idx} className="w-8 h-8 rounded-full gradient-indigo flex items-center justify-center text-white text-sm border-2 border-background">
                                      {assignee.avatar}
                                    </div>
                                  ))}
                                  {assignees.length === 0 && (
                                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
                                      ?
                                    </div>
                                  )}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Tasks;