import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useData from '@/contexts/useData';
import { User } from '@/lib/mockData';
import { toast } from 'sonner';

interface MemberModalProps {
  open: boolean;
  onClose: () => void;
  member?: User;
}

const MemberModal = ({ open, onClose, member }: MemberModalProps) => {
  const { addUser, updateUser } = useData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'password123',
    role: 'member',
    avatar: '👤',
    status: 'active',
  });

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        email: member.email,
        password: member.password,
        role: member.role,
        avatar: member.avatar,
        status: member.status,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: 'password123',
        role: 'member',
        avatar: '👤',
        status: 'active',
      });
    }
  }, [member, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (member) {
      updateUser(member.id, formData as Partial<User>);
      toast.success('Member updated successfully');
    } else {
      addUser(formData as Omit<User, 'id'>);
      toast.success('Member added successfully');
    }
    
    onClose();
  };

  const avatars = ['👨‍💼', '👩‍💼', '👨‍💻', '👩‍💻', '🧑‍💼', '👤', '🙋', '🙋‍♀️', '🙋‍♂️'];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {member ? 'Edit Member' : 'Add New Member'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter name"
              className="rounded-xl"
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email"
              className="rounded-xl"
            />
          </div>

          <div>
            <Label>Role</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="leader">Leader</SelectItem>
                <SelectItem value="member">Member</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="away">Away</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Avatar</Label>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {avatars.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setFormData({ ...formData, avatar: emoji })}
                  className={`text-2xl p-3 rounded-xl border-2 transition-all ${
                    formData.avatar === emoji
                      ? 'border-primary bg-primary/10 scale-110'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">
              Cancel
            </Button>
            <Button type="submit" className="gradient-indigo text-white rounded-xl hover:scale-105 transition-transform">
              {member ? 'Update' : 'Add'} Member
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MemberModal;
