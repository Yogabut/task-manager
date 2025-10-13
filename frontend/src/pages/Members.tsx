import { useState } from 'react';
import useData from '@/contexts/useData';
import { useAuth } from '@/contexts';
import MemberModal from '@/components/modals/MemberModal';
import { User } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Mail, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Members = () => {
  const { user } = useAuth();
  const { users, deleteUser } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<User | undefined>();

  // Only admins can access this page
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return 'gradient-purple text-white';
      case 'leader':
        return 'gradient-blue text-white';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success';
      case 'away':
        return 'bg-warning';
      case 'busy':
        return 'bg-danger';
      default:
        return 'bg-muted';
    }
  };

  const handleEdit = (member: User) => {
    setSelectedMember(member);
    setModalOpen(true);
  };

  const handleDelete = (userId: string) => {
    if (userId === user?.id) {
      toast.error('You cannot delete yourself');
      return;
    }
    if (window.confirm('Are you sure you want to delete this member?')) {
      deleteUser(userId);
      toast.success('Member deleted successfully');
    }
  };

  return (
    <>
      <MemberModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedMember(undefined);
        }}
        member={selectedMember}
      />
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Team Members</h1>
          <p className="text-muted-foreground">
            Manage your team members and their roles
          </p>
        </div>
        <Button 
          onClick={() => setModalOpen(true)}
          className="gradient-indigo text-white hover:scale-105 transition-transform rounded-xl shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((member) => (
          <div
            key={member.id}
            className="bg-card rounded-3xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="w-16 h-16 gradient-indigo">
                    <AvatarFallback className="bg-transparent text-white text-2xl">
                      {member.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-card ${getStatusColor(member.status)}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <Badge className={`mt-1 text-xs ${getRoleBadge(member.role)}`}>
                    {member.role}
                  </Badge>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEdit(member)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleDelete(member.id)}
                    className="text-danger"
                    disabled={member.id === user?.id}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="w-4 h-4 mr-2" />
                <span className="truncate">{member.email}</span>
              </div>
            </div>

            {/* Status */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="outline" className="capitalize">
                  {member.status}
                </Badge>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <Button variant="outline" size="sm" className="rounded-xl">
                View Profile
              </Button>
              <Button variant="outline" size="sm" className="rounded-xl">
                Message
              </Button>
            </div>
          </div>
        ))}
      </div>
      </div>
    </>
  );
};

export default Members;
