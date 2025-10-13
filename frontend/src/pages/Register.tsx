import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'leader' | 'member'>('member');
  const [adminInviteToken, setAdminInviteToken] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
  const basePayload = { name, email, password, role };
  const payloadWithToken = role === 'admin' ? { ...basePayload, adminInviteToken } : basePayload;
  await api.auth.register(payloadWithToken as { name: string; email: string; password: string; role: string; adminInviteToken?: string });
      toast.success('Registration successful — please sign in');
      navigate('/login');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-8">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-3xl shadow-xl p-8 space-y-6">
          <h2 className="text-2xl font-bold">Create account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required className="h-12 rounded-xl" />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-12 rounded-xl" />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-12 rounded-xl" />
            </div>
            <div>
              <Label>Role</Label>
              <select value={role} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRole(e.target.value as 'admin' | 'leader' | 'member')} className="w-full h-12 rounded-xl p-2">
                <option value="member">Member</option>
                <option value="leader">Leader</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {role === 'admin' && (
              <div>
                <Label>Admin invite token</Label>
                <Input value={adminInviteToken} onChange={(e) => setAdminInviteToken(e.target.value)} className="h-12 rounded-xl" />
              </div>
            )}
            <Button type="submit" className="w-full h-12 rounded-xl gradient-indigo text-white">Register</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
