import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts';
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  CheckSquare, 
  Briefcase, 
  Bot,
  Clock,
  Settings,
  LogOut
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    ...(user?.role === 'admin' ? [{ name: 'Members', icon: Users, path: '/members' }] : []),
    { name: 'Projects', icon: FolderKanban, path: '/projects' },
    { name: 'Tasks', icon: CheckSquare, path: '/tasks' },
    { name: 'Calendar', icon: Clock, path: '/calendar' },
    { name: 'Your Work', icon: Briefcase, path: '/your-work' },
    { name: 'AI Assistant', icon: Bot, path: '/ai' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'gradient-purple text-white';
      case 'leader':
        return 'gradient-blue text-white';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <aside className="w-72 bg-sidebar border-r border-sidebar-border flex flex-col h-screen sticky top-0">
      {/* User Profile */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <Avatar className="w-12 h-12 gradient-indigo flex items-center justify-center text-2xl">
            <AvatarFallback className="bg-transparent text-white">
              {user?.avatar}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sidebar-foreground truncate">
              {user?.name}
            </p>
            <Badge className={`mt-1 text-xs ${getRoleBadgeColor(user?.role || '')}`}>
              {user?.role}
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group ${
                isActive
                  ? 'gradient-indigo text-white shadow-lg'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110' : 'group-hover:scale-110'
                  }`} 
                />
                <span className="font-medium">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          onClick={logout}
          variant="ghost"
          className="w-full justify-start space-x-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-xl"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
