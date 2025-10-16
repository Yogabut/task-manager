import { useAuth } from '@/contexts';
import useData from '@/contexts/useData';
import StatsCard from '@/components/dashboard/StatsCard';
import { mockActivities } from '@/lib/mockData';
import { 
  FolderKanban, 
  CheckSquare, 
  Users, 
  Clock,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const { projects, tasks, users } = useData();

  const stats = {
    totalProjects: projects.length,
    activeTasks: tasks.filter(t => t.status === 'in-progress').length,
    teamMembers: users.length,
    upcomingDeadlines: tasks.filter(t => {
      const dueDate = new Date(t.dueDate);
      const today = new Date();
      const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
      return diffDays <= 7 && diffDays >= 0;
    }).length,
  };

  const myTasks = user ? tasks.filter(t => t.assigneeIds?.includes(user.id)) : [];
  const recentProjects = projects.slice(0, 3);
  const { recentCompletedTasks } = useData();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success/10 text-success';
      case 'ongoing':
        return 'bg-primary/10 text-primary';
      case 'planning':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-danger/10 text-danger border-l-4 border-danger';
      case 'high':
        return 'bg-warning/10 text-warning border-l-4 border-warning';
      case 'medium':
        return 'bg-primary/10 text-primary border-l-4 border-primary';
      default:
        return 'bg-muted/10 text-muted-foreground border-l-4 border-muted';
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-4xl font-bold mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-muted-foreground text-lg">
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={FolderKanban}
          gradient="gradient-purple"
          trend="+2 this month"
        />
        <StatsCard
          title="Active Tasks"
          value={stats.activeTasks}
          icon={CheckSquare}
          gradient="gradient-blue"
          trend="+5 this week"
        />
        <StatsCard
          title="Team Members"
          value={stats.teamMembers}
          icon={Users}
          gradient="gradient-pink"
        />
        <StatsCard
          title="Upcoming Deadlines"
          value={stats.upcomingDeadlines}
          icon={Clock}
          gradient="gradient-emerald"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2 bg-card rounded-3xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Projects</h2>
            <Button 
              variant="ghost" 
              className="group" 
              asChild
            >
              <Link to="/projects">
                View All
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className="bg-background rounded-2xl p-5 hover:shadow-md transition-all cursor-pointer border border-border"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{project.name}</h3>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  </div>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
                <div className="flex items-center justify-between mt-4 text-sm">
                  <div className="flex -space-x-2">
                    {project.memberIds.slice(0, 3).map((memberId, idx) => {
                      const member = users.find(u => u.id === memberId);
                      return (
                        <div
                          key={idx}
                          className="w-8 h-8 rounded-full gradient-indigo flex items-center justify-center border-2 border-background"
                        >
                          <span className="text-white text-xs">{member?.avatar}</span>
                        </div>
                      );
                    })}
                  </div>
                  <span className="text-muted-foreground">
                    Due {new Date(project.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-3xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {(recentCompletedTasks.length > 0 ? recentCompletedTasks.map((task) => (
              <div key={task.id} className="flex space-x-3">
                <div className="w-10 h-10 rounded-full gradient-indigo flex items-center justify-center text-white flex-shrink-0">
                  ✅
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">Task completed: {task.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {task.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Just now</p>
                </div>
              </div>
            )) : mockActivities.map((activity) => (
              <div key={activity.id} className="flex space-x-3">
                <div className="w-10 h-10 rounded-full gradient-indigo flex items-center justify-center text-white flex-shrink-0">
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{activity.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            )))}
          </div>
        </div>
      </div>

      {/* My Tasks */}
      <div className="bg-card rounded-3xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">My Tasks</h2>
          <Badge className="gradient-indigo text-white px-3 py-1">
            {myTasks.length} tasks
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myTasks.length > 0 ? (
            myTasks.map((task) => (
              <div
                key={task.id}
                className={`bg-background rounded-2xl p-4 hover:shadow-md transition-all cursor-pointer ${getPriorityColor(task.priority)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{task.title}</h3>
                  <Badge className={`text-xs ${
                    task.status === 'done' ? 'bg-success text-white' :
                    task.status === 'in-progress' ? 'bg-primary text-white' :
                    task.status === 'review' ? 'bg-warning text-white' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {task.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {task.description}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                  <span className="capitalize font-medium">{task.priority}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No tasks assigned to you yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
