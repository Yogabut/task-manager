import { useAuth } from '@/contexts';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings as SettingsIcon, User, Bell, Shield, Palette } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 gradient-purple rounded-2xl flex items-center justify-center shadow-lg">
          <SettingsIcon className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile */}
        <div className="bg-card rounded-3xl p-6 shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 gradient-indigo rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Profile</h2>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-muted-foreground">Name</Label>
              <p className="text-lg font-medium mt-1">{user?.name}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Email</Label>
              <p className="text-lg font-medium mt-1">{user?.email}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Role</Label>
              <p className="text-lg font-medium mt-1 capitalize">{user?.role}</p>
            </div>
            <Button className="gradient-indigo text-white rounded-xl hover:scale-105 transition-transform">
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-card rounded-3xl p-6 shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 gradient-pink rounded-xl flex items-center justify-center">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Appearance</h2>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-lg font-medium">Dark Mode</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Toggle between light and dark themes
                </p>
              </div>
              <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-card rounded-3xl p-6 shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 gradient-blue rounded-xl flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Notifications</h2>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Email Notifications</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Receive email updates about your tasks
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Push Notifications</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Get notified about important updates
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Task Reminders</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Remind me about upcoming deadlines
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-card rounded-3xl p-6 shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 gradient-emerald rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Security</h2>
          </div>
          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-start rounded-xl">
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start rounded-xl">
              Two-Factor Authentication
            </Button>
            <Button variant="outline" className="w-full justify-start rounded-xl text-danger">
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
