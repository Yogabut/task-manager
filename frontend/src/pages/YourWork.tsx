import { useAuth } from '@/contexts';
import useData from '@/contexts/useData';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const YourWork = () => {
  const { user } = useAuth();
  const { tasks, projects } = useData();

  const myTasks = user ? tasks.filter(t => t.assigneeIds?.includes(user.id)) : [];
  const myProjects = user ? projects.filter(p => p.memberIds.includes(user.id)) : [];

  const tasksByStatus = {
    todo: myTasks.filter(t => t.status === 'todo'),
    inProgress: myTasks.filter(t => t.status === 'in-progress'),
    review: myTasks.filter(t => t.status === 'review'),
    done: myTasks.filter(t => t.status === 'done'),
  };

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

  return (
    <div className="space-y-8">
      {/* Header with Avatar */}
      <div className="flex items-center space-x-4">
        <Avatar className="w-20 h-20 gradient-indigo">
          <AvatarFallback className="bg-transparent text-white text-3xl">
            {user?.avatar}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-4xl font-bold mb-2">Your Work</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}! Here's your personalized dashboard
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-1">To Do</p>
              <p className="text-3xl font-bold">{tasksByStatus.todo.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-muted/30 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-muted-foreground" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-1">In Progress</p>
              <p className="text-3xl font-bold">{tasksByStatus.inProgress.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl gradient-blue flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-1">In Review</p>
              <p className="text-3xl font-bold">{tasksByStatus.review.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl gradient-pink flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Completed</p>
              <p className="text-3xl font-bold">{tasksByStatus.done.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl gradient-emerald flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* My Projects */}
      <div>
        <h2 className="text-2xl font-bold mb-4">My Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myProjects.map((project) => (
            <div
              key={project.id}
              className="bg-card rounded-3xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold">{project.name}</h3>
                <Badge className={
                  project.status === 'completed' ? 'bg-success text-white' :
                  project.status === 'ongoing' ? 'bg-primary text-white' :
                  'bg-warning text-white'
                }>
                  {project.status}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm mb-4">{project.description}</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Tasks */}
      <div>
        <h2 className="text-2xl font-bold mb-4">My Tasks</h2>
        <div className="bg-card rounded-3xl p-6 shadow-lg space-y-3">
          {myTasks.length > 0 ? (
            myTasks.map((task) => {
              const project = projects.find(p => p.id === task.projectId);
              return (
                <div
                  key={task.id}
                  className="bg-background rounded-2xl p-5 hover:shadow-md transition-all cursor-pointer border-l-4"
                  style={{
                    borderLeftColor:
                      task.priority === 'urgent' ? 'hsl(var(--danger))' :
                      task.priority === 'high' ? 'hsl(var(--warning))' :
                      'hsl(var(--primary))'
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{task.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                      <Badge variant="outline" className="text-xs">
                        {project?.name}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <Badge className={
                        task.status === 'done' ? 'bg-success text-white' :
                        task.status === 'in-progress' ? 'bg-primary text-white' :
                        task.status === 'review' ? 'bg-warning text-white' :
                        'bg-muted text-muted-foreground'
                      }>
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-1" />
                    Due {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No tasks assigned to you yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default YourWork;
