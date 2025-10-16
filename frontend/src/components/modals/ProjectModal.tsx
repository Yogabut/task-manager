import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useData from '@/contexts/useData';
import { useAuth } from '@/contexts';
import { Project } from '@/lib/mockData';
import { toast } from 'sonner';

interface ProjectModalProps {
  open: boolean;
  onClose: () => void;
  project?: Project;
}

const ProjectModal = ({ open, onClose, project }: ProjectModalProps) => {
  const { addProject, updateProject, users } = useData();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'normal',
    status: 'planning',
    progress: 0,
    leaderId: '',
    memberIds: [] as string[],
    startDate: '',
    endDate: '',
    color: 'gradient-blue',
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description,
        category: project.category,
        status: project.status,
        progress: project.progress,
        leaderId: project.leaderId,
        memberIds: project.memberIds,
        startDate: project.startDate,
        endDate: project.endDate,
        color: project.color,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: 'normal',
        status: 'planning',
        progress: 0,
        leaderId: user?.id || '',
        memberIds: [],
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        color: 'gradient-blue',
      });
    }
  }, [project, user, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please enter a project name');
      return;
    }

    if (project) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updateProject(project.id, formData as any);
      toast.success('Project updated successfully');
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      addProject(formData as any);
      toast.success('Project created successfully');
    }
    
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {project ? 'Edit Project' : 'Create New Project'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Project Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter project name"
                className="rounded-xl"
              />
            </div>

            <div className="col-span-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter project description"
                className="rounded-xl"
                rows={3}
              />
            </div>

            <div>
              <Label>Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="important">Important</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
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
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Start Date</Label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="rounded-xl"
              />
            </div>

            <div>
              <Label>End Date</Label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="rounded-xl"
              />
            </div>

            <div>
              <Label>Project Leader</Label>
              <Select value={formData.leaderId} onValueChange={(value) => setFormData({ ...formData, leaderId: value })}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select leader" />
                </SelectTrigger>
                <SelectContent>
                  {users.filter(u => u.role === 'admin' || u.role === 'leader').map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Color Theme</Label>
              <Select value={formData.color} onValueChange={(value) => setFormData({ ...formData, color: value })}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gradient-blue">Blue</SelectItem>
                  <SelectItem value="gradient-purple">Purple</SelectItem>
                  <SelectItem value="gradient-pink">Pink</SelectItem>
                  <SelectItem value="gradient-emerald">Emerald</SelectItem>
                  <SelectItem value="gradient-indigo">Indigo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Progress (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
                className="rounded-xl"
              />
            </div>

            <div className="col-span-2">
              <Label>Team Members</Label>
              <Select 
                value={formData.memberIds[formData.memberIds.length - 1] || ''} 
                onValueChange={(value) => {
                  if (!formData.memberIds.includes(value)) {
                    setFormData({ ...formData, memberIds: [...formData.memberIds, value] });
                  }
                }}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Add team members" />
                </SelectTrigger>
                <SelectContent>
                  {users.filter(u => !formData.memberIds.includes(u.id)).map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.memberIds.map(memberId => {
                  const member = users.find(u => u.id === memberId);
                  return member ? (
                    <span key={memberId} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      {member.name}
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, memberIds: formData.memberIds.filter(id => id !== memberId) })}
                        className="hover:text-danger"
                      >
                        ×
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">
              Cancel
            </Button>
            <Button type="submit" className="gradient-indigo text-white rounded-xl hover:scale-105 transition-transform">
              {project ? 'Update' : 'Create'} Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
