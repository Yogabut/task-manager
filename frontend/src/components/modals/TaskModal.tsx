import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import useData from '@/contexts/useData';
import { Task } from '@/lib/mockData';
import { toast } from 'sonner';

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  task?: Task;
}

const TaskModal = ({ open, onClose, task }: TaskModalProps) => {
  const { addTask, updateTask, deleteTask, projects, users } = useData();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    priority: 'medium',
    status: 'todo',
    assigneeIds: [] as string[],
    dueDate: '',
    checklist: [],
    comments: [],
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        projectId: task.projectId,
        priority: task.priority,
        status: task.status,
        assigneeIds: task.assigneeIds || [],
        dueDate: task.dueDate,
        checklist: task.checklist,
        comments: task.comments,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        projectId: projects[0]?.id || '',
        priority: 'medium',
        status: 'todo',
        assigneeIds: [],
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        checklist: [],
        comments: [],
      });
    }
  }, [task, projects, users, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    if (task) {
      updateTask(task.id, formData as Partial<Task>);
      toast.success('Task updated successfully');
    } else {
      addTask(formData as Omit<Task, 'id'>);
      toast.success('Task created successfully');
    }
    
    onClose();
  };

  const handleDelete = async () => {
    if (!task) return;
    
    try {
      await deleteTask(task.id);
      toast.success('Task deleted successfully');
      setShowDeleteDialog(false);
      onClose();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {task ? 'Edit Task' : 'Create New Task'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Task Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter task title"
                  className="rounded-xl"
                />
              </div>

              <div className="col-span-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter task description"
                  className="rounded-xl"
                  rows={3}
                />
              </div>

              <div>
                <Label>Project</Label>
                <Select value={formData.projectId} onValueChange={(value) => setFormData({ ...formData, projectId: value })}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label>Assignees</Label>
                <Select 
                  value={formData.assigneeIds[formData.assigneeIds.length - 1] || ''} 
                  onValueChange={(value) => {
                    if (!formData.assigneeIds.includes(value)) {
                      setFormData({ ...formData, assigneeIds: [...formData.assigneeIds, value] });
                    }
                  }}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Add assignees" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.filter(u => !formData.assigneeIds.includes(u.id)).map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.assigneeIds.map(assigneeId => {
                    const assignee = users.find(u => u.id === assigneeId);
                    return assignee ? (
                      <span key={assigneeId} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {assignee.name}
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, assigneeIds: formData.assigneeIds.filter(id => id !== assigneeId) })}
                          className="hover:text-danger"
                        >
                          ×
                        </button>
                      </span>
                    ) : null;
                  })}
                </div>
              </div>

              <div>
                <Label>Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
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
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              {task && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={() => setShowDeleteDialog(true)} 
                  className="rounded-xl"
                >
                  Delete Task
                </Button>
              )}
              <div className="flex items-center space-x-3 ml-auto">
                <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" className="gradient-indigo text-white rounded-xl hover:scale-105 transition-transform">
                  {task ? 'Update' : 'Create'} Task
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task
              and remove it from the project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TaskModal;