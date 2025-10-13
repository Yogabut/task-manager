export type UserRole = 'admin' | 'leader' | 'member';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar: string;
  status: 'active' | 'away' | 'busy';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  category: 'urgent' | 'important' | 'normal';
  status: 'planning' | 'ongoing' | 'completed' | 'on-hold';
  leaderId: string;
  memberIds: string[];
  progress: number;
  startDate: string;
  endDate: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'review' | 'done';
  assigneeIds: string[];
  dueDate: string;
  checklist: { id: string; text: string; completed: boolean }[];
  comments: { id: string; userId: string; text: string; timestamp: string }[];
}

export const mockUsers: User[] = [
  { 
    id: '1', 
    name: 'Admin User', 
    email: 'admin@example.com', 
    password: 'password123', 
    role: 'admin', 
    avatar: '👨‍💼',
    status: 'active'
  },
  { 
    id: '2', 
    name: 'John Leader', 
    email: 'leader@example.com', 
    password: 'password123', 
    role: 'leader', 
    avatar: '👨‍💻',
    status: 'active'
  },
  { 
    id: '3', 
    name: 'Sarah Member', 
    email: 'member@example.com', 
    password: 'password123', 
    role: 'member', 
    avatar: '👩‍💼',
    status: 'active'
  },
  { 
    id: '4', 
    name: 'Mike Developer', 
    email: 'mike@example.com', 
    password: 'password123', 
    role: 'member', 
    avatar: '👨‍🔧',
    status: 'away'
  },
  { 
    id: '5', 
    name: 'Emma Designer', 
    email: 'emma@example.com', 
    password: 'password123', 
    role: 'member', 
    avatar: '👩‍🎨',
    status: 'busy'
  },
];

export const mockProjects: Project[] = [
  { 
    id: 'p1', 
    name: 'Mobile App Development', 
    description: 'Build a cross-platform mobile application',
    category: 'urgent', 
    status: 'ongoing', 
    leaderId: '2', 
    memberIds: ['2', '3', '4'], 
    progress: 65, 
    startDate: '2025-01-01', 
    endDate: '2025-06-30',
    color: 'gradient-purple'
  },
  { 
    id: 'p2', 
    name: 'Website Redesign', 
    description: 'Modernize company website with new branding',
    category: 'important', 
    status: 'ongoing', 
    leaderId: '2', 
    memberIds: ['2', '5'], 
    progress: 40, 
    startDate: '2025-02-01', 
    endDate: '2025-05-15',
    color: 'gradient-pink'
  },
  { 
    id: 'p3', 
    name: 'API Integration', 
    description: 'Integrate third-party APIs for data synchronization',
    category: 'normal', 
    status: 'planning', 
    leaderId: '2', 
    memberIds: ['2', '4'], 
    progress: 15, 
    startDate: '2025-03-01', 
    endDate: '2025-07-30',
    color: 'gradient-blue'
  },
  { 
    id: 'p4', 
    name: 'Marketing Campaign', 
    description: 'Launch Q2 marketing campaign across all channels',
    category: 'important', 
    status: 'completed', 
    leaderId: '2', 
    memberIds: ['2', '3', '5'], 
    progress: 100, 
    startDate: '2024-12-01', 
    endDate: '2025-03-31',
    color: 'gradient-emerald'
  },
  { 
    id: 'p5', 
    name: 'Security Audit', 
    description: 'Comprehensive security review and penetration testing',
    category: 'urgent', 
    status: 'on-hold', 
    leaderId: '2', 
    memberIds: ['2', '4'], 
    progress: 25, 
    startDate: '2025-01-15', 
    endDate: '2025-04-15',
    color: 'gradient-indigo'
  },
];

export const mockTasks: Task[] = [
  { 
    id: 't1', 
    title: 'Design Authentication UI', 
    description: 'Create login and signup screens with modern design',
    projectId: 'p1', 
    priority: 'high', 
    status: 'in-progress', 
    assigneeIds: ['3', '5'], 
    dueDate: '2025-10-20',
    checklist: [
      { id: 'c1', text: 'Design wireframes', completed: true },
      { id: 'c2', text: 'Create high-fidelity mockups', completed: true },
      { id: 'c3', text: 'Implement UI components', completed: false },
    ],
    comments: [
      { id: 'cm1', userId: '2', text: 'Looking great! Let\'s add social login options.', timestamp: '2025-10-05T10:30:00' },
    ]
  },
  { 
    id: 't2', 
    title: 'Implement API Endpoints', 
    description: 'Build RESTful API for user management',
    projectId: 'p1', 
    priority: 'urgent', 
    status: 'in-progress', 
    assigneeIds: ['4'], 
    dueDate: '2025-10-15',
    checklist: [
      { id: 'c4', text: 'Set up Express server', completed: true },
      { id: 'c5', text: 'Create user routes', completed: true },
      { id: 'c6', text: 'Add authentication middleware', completed: false },
    ],
    comments: []
  },
  { 
    id: 't3', 
    title: 'Update Homepage Hero', 
    description: 'Redesign hero section with new imagery and copy',
    projectId: 'p2', 
    priority: 'medium', 
    status: 'review', 
    assigneeIds: ['5'], 
    dueDate: '2025-10-18',
    checklist: [
      { id: 'c7', text: 'Select hero images', completed: true },
      { id: 'c8', text: 'Write compelling copy', completed: true },
      { id: 'c9', text: 'Implement responsive design', completed: true },
    ],
    comments: [
      { id: 'cm2', userId: '2', text: 'This looks fantastic! Ready for final review.', timestamp: '2025-10-08T14:20:00' },
    ]
  },
  { 
    id: 't4', 
    title: 'Database Schema Design', 
    description: 'Design normalized database schema for new features',
    projectId: 'p3', 
    priority: 'high', 
    status: 'todo', 
    assigneeIds: ['4'], 
    dueDate: '2025-10-25',
    checklist: [],
    comments: []
  },
  { 
    id: 't5', 
    title: 'Create Social Media Assets', 
    description: 'Design graphics for Instagram, Facebook, and Twitter',
    projectId: 'p4', 
    priority: 'low', 
    status: 'done', 
    assigneeIds: ['5'], 
    dueDate: '2025-09-30',
    checklist: [
      { id: 'c10', text: 'Instagram posts', completed: true },
      { id: 'c11', text: 'Facebook banners', completed: true },
      { id: 'c12', text: 'Twitter cards', completed: true },
    ],
    comments: []
  },
  { 
    id: 't6', 
    title: 'Performance Testing', 
    description: 'Run load tests and optimize database queries',
    projectId: 'p1', 
    priority: 'medium', 
    status: 'todo', 
    assigneeIds: ['4', '3'], 
    dueDate: '2025-11-01',
    checklist: [],
    comments: []
  },
];

export interface Activity {
  id: string;
  type: 'project_created' | 'task_completed' | 'member_added' | 'status_changed' | 'comment_added';
  userId: string;
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

export const mockActivities: Activity[] = [
  {
    id: 'a1',
    type: 'task_completed',
    userId: '5',
    title: 'Task completed',
    description: 'Sarah completed "Create Social Media Assets"',
    timestamp: '2 hours ago',
    icon: '✅'
  },
  {
    id: 'a2',
    type: 'comment_added',
    userId: '2',
    title: 'New comment',
    description: 'John commented on "Update Homepage Hero"',
    timestamp: '4 hours ago',
    icon: '💬'
  },
  {
    id: 'a3',
    type: 'status_changed',
    userId: '3',
    title: 'Status updated',
    description: 'Sarah moved task to "In Progress"',
    timestamp: '6 hours ago',
    icon: '🔄'
  },
  {
    id: 'a4',
    type: 'member_added',
    userId: '1',
    title: 'Team member added',
    description: 'Admin added Mike to "Mobile App Development"',
    timestamp: '1 day ago',
    icon: '👥'
  },
  {
    id: 'a5',
    type: 'project_created',
    userId: '1',
    title: 'New project',
    description: 'Admin created "Security Audit" project',
    timestamp: '2 days ago',
    icon: '🚀'
  },
];
