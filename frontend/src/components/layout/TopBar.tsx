import { useState } from 'react';
import { useAuth } from '@/contexts';
import { useTheme } from '@/contexts/ThemeContext';
import { Search, Bell, Sun, Moon } from 'lucide-react';
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

const TopBar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

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
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 gradient-pink text-white text-xs">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 rounded-2xl bg-popover">
              <DropdownMenuLabel className="font-semibold text-base">Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-y-auto">
                <DropdownMenuItem className="p-4 cursor-pointer rounded-xl">
                  <div>
                    <p className="font-medium">New task assigned</p>
                    <p className="text-sm text-muted-foreground">Admin Assigned the new project and task to you</p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-4 cursor-pointer rounded-xl">
                  <div>
                    <p className="font-medium">Project update</p>
                    <p className="text-sm text-muted-foreground">The project has updated with new tasks </p>
                    <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-4 cursor-pointer rounded-xl">
                  <div>
                    <p className="font-medium">Your Team Work</p>
                    <p className="text-sm text-muted-foreground">Another team is waiting for your works</p>
                    <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                  </div>
                </DropdownMenuItem>
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
