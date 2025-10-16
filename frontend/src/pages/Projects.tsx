import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useData from '@/contexts/useData';
import { useAuth } from '@/contexts';
import ProjectModal from '@/components/modals/ProjectModal';
import { Project } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Grid, List, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';

const Projects = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { projects, users, deleteProject } = useData();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success/10 text-success';
      case 'ongoing':
        return 'bg-primary/10 text-primary';
      case 'planning':
        return 'bg-warning/10 text-warning';
      case 'on-hold':
        return 'bg-danger/10 text-danger';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'urgent':
        return 'gradient-pink text-white';
      case 'important':
        return 'gradient-purple text-white';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/tasks?project=${projectId}`);
  };

  const handleEdit = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation(); // Prevent navigation when editing
    setSelectedProject(project);
    setModalOpen(true);
  };

  const handleDelete = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation(); // Prevent navigation when deleting
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(projectId);
      toast.success('Project deleted successfully');
    }
  };

  return (
    <>
      <ProjectModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedProject(undefined);
        }}
        project={selectedProject}
      />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Projects</h1>
            <p className="text-muted-foreground">
              Manage and track all your projects
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-card rounded-xl p-1 shadow-sm">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'gradient-indigo text-white' : ''}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'gradient-indigo text-white' : ''}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            {user?.role === 'admin' && (
              <Button 
                onClick={() => setModalOpen(true)}
                className="gradient-indigo text-white hover:scale-105 transition-transform rounded-xl shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            )}
          </div>
        </div>

        {/* Projects Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => handleProjectClick(project.id)}
                className="bg-card rounded-3xl overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              >
                {/* Gradient Header */}
                <div className={`${project.color} h-24 relative`}>
                  <div className="absolute top-4 left-4">
                    <Badge className={getCategoryBadge(project.category)}>
                      {project.category}
                    </Badge>
                  </div>
                  {user?.role === 'admin' && (
                    <div className="absolute top-4 right-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => handleEdit(e, project)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => handleDelete(e, project.id)}
                            className="text-danger"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Progress */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>

                  {/* Team & Date */}
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {project.memberIds.slice(0, 4).map((memberId, idx) => {
                        const member = users.find(u => u.id === memberId);
                        return (
                          <div
                            key={idx}
                            className="w-9 h-9 rounded-full gradient-indigo flex items-center justify-center border-2 border-card"
                            title={member?.name}
                          >
                            <span className="text-white text-sm">{member?.avatar}</span>
                          </div>
                        );
                      })}
                      {project.memberIds.length > 4 && (
                        <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center border-2 border-card text-xs font-medium">
                          +{project.memberIds.length - 4}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Due {new Date(project.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="bg-card rounded-3xl p-6 shadow-lg space-y-3">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => handleProjectClick(project.id)}
                className="bg-background rounded-2xl p-5 hover:shadow-md transition-all cursor-pointer border border-border"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold">{project.name}</h3>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                      <Badge className={getCategoryBadge(project.category)}>
                        {project.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  </div>
                  <div className="flex items-center space-x-8 ml-8">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{project.progress}%</p>
                      <p className="text-xs text-muted-foreground">Progress</p>
                    </div>
                    <div className="flex -space-x-2">
                      {project.memberIds.slice(0, 3).map((memberId, idx) => {
                        const member = users.find(u => u.id === memberId);
                        return (
                          <div
                            key={idx}
                            className="w-9 h-9 rounded-full gradient-indigo flex items-center justify-center border-2 border-background"
                          >
                            <span className="text-white text-sm">{member?.avatar}</span>
                          </div>
                        );
                      })}
                    </div>
                    {user?.role === 'admin' && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="rounded-full">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => handleEdit(e, project)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => handleDelete(e, project.id)}
                            className="text-danger"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Projects;