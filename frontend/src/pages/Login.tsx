import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      toast.success('Welcome back!');
      navigate('/');
    } else {
      toast.error('Invalid credentials. Try admin@example.com / password123');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Gradient */}
      <div className="hidden lg:flex lg:w-1/2 gradient-indigo items-center justify-center p-12">
        <div className="text-white text-center max-w-md mx-auto flex flex-col items-center animate-fade-in">
          <img src="./logo.png" alt="" className="h-40 w-45" />
          <h1 className="text-3xl font-bold mb-2">Project Management</h1>
          <p className="text-xl text-white/90">
            Collaborate, track progress, and achieve your goals with our modern dashboard
          </p>
        </div>

      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md animate-scale-in">
          <div className="bg-card rounded-3xl shadow-xl p-8 space-y-8">
            <div className="text-center">
              <div className="w-20 h-20 items-center justify-center mx-auto">
                <img src="./logo.png" alt="" />
              </div>
              <h2 className="text-3xl font-bold">Welcome Back</h2>
              <p className="text-muted-foreground mt-2">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="password123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 rounded-xl"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl gradient-indigo hover:scale-105 transition-transform text-white font-medium"
              >
                Sign In
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
