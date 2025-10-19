import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts';
import useData from '@/contexts/useData';
import { useTheme } from '@/contexts/ThemeContext';
import { Search, Bell, Sun, Moon, CheckCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface Notification {
  id: string;
  type: 'task' | 'project';
  title: string;
  message: string;
  taskId?: string;
  projectId?: string;
  createdAt: Date;
  read: boolean;
}

const TopBar = () => {
  const { user, logout } = useAuth();
  const { tasks, projects } = useData();
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Generate notifications based on tasks and projects assigned to current user
  useEffect(() => {
    if (!user) return;

    const newNotifications: Notification[] = [];

    // Check for tasks assigned to user
    tasks.forEach(task => {
      if (task.assigneeIds?.includes(user.id)) {
        const taskDate = new Date(task.dueDate);
        const now = new Date();
        const isNew = (now.getTime() - taskDate.getTime()) < 7 * 24 * 60 * 60 * 1000; // Last 7 days

        if (isNew) {
          const project = projects.find(p => p.id === task.projectId);
          newNotifications.push({
            id: `task-${task.id}`,
            type: 'task',
            title: 'New task assigned',
            message: `You have been assigned to "${task.title}" in ${project?.name || 'a project'}`,
            taskId: task.id,
            projectId: task.projectId,
            createdAt: taskDate,
            read: false,
          });
        }
      }
    });

    // Check for projects where user is a member
    projects.forEach(project => {
      if (project.memberIds?.includes(user.id)) {
        const projectDate = new Date(project.startDate);
        const now = new Date();
        const isNew = (now.getTime() - projectDate.getTime()) < 7 * 24 * 60 * 60 * 1000; // Last 7 days

        if (isNew) {
          newNotifications.push({
            id: `project-${project.id}`,
            type: 'project',
            title: 'Added to new project',
            message: `You have been added to "${project.name}" project`,
            projectId: project.id,
            createdAt: projectDate,
            read: false,
          });
        }
      }
    });

    // Sort by date (newest first)
    newNotifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Load read status from localStorage (per user)
    const storageKey = `readNotifications_${user.id}`;
    const readNotifications = JSON.parse(localStorage.getItem(storageKey) || '[]');
    newNotifications.forEach(notif => {
      if (readNotifications.includes(notif.id)) {
        notif.read = true;
      }
    });

    setNotifications(newNotifications);
  }, [user, tasks, projects]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );

    // Save to localStorage (per user)
    const storageKey = `readNotifications_${user?.id}`;
    const readNotifications = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (!readNotifications.includes(notificationId)) {
      readNotifications.push(notificationId);
      localStorage.setItem(storageKey, JSON.stringify(readNotifications));
    }
  };

  const markAllAsRead = () => {
    const allIds = notifications.map(n => n.id);
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    
    // Save to localStorage (per user)
    const storageKey = `readNotifications_${user?.id}`;
    localStorage.setItem(storageKey, JSON.stringify(allIds));
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="h-full px-6 flex items-center justify-end">
        {/* Right side actions */}
        <div className="flex items-center space-x-3 ml-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full hover:bg-accent"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent relative">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 gradient-pink text-white text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 rounded-2xl bg-popover">
              <div className="flex items-center justify-between px-4 py-2">
                <DropdownMenuLabel className="font-semibold text-base p-0">Notifications</DropdownMenuLabel>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="h-8 text-xs"
                  >
                    <CheckCheck className="w-4 h-4 mr-1" />
                    Mark all read
                  </Button>
                )}
              </div>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No notifications</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <DropdownMenuItem 
                      key={notification.id}
                      className={`p-4 cursor-pointer rounded-xl ${!notification.read ? 'bg-primary/5' : ''}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3 w-full">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{notification.title}</p>
                            {!notification.read && (
                              <div className="w-2 h-2 rounded-full bg-primary" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {getTimeAgo(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 rounded-full pl-2 pr-4 hover:bg-accent">
                <Avatar className="w-8 h-8 gradient-indigo mr-2">
                  <AvatarFallback className="bg-transparent text-white text-sm">
                    {user?.avatar}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{user?.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl bg-popover">
              <DropdownMenuLabel>
                <div>
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-xl cursor-pointer">Profile</DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl cursor-pointer">Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="rounded-xl cursor-pointer text-danger"
                onClick={logout}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default TopBar;