# Task & Project Management System

A complete, modern task and project management application with separate Admin and User interfaces. Built with React (Frontend) and Node.js + Express + MongoDB (Backend).

## 🌟 Features

### 🎯 Project Management
- **Create & Manage Projects**: Organize work into distinct projects
- **Project Dashboard**: Track progress, budget, and team members
- **Project Statistics**: View task completion rates and project status
- **Team Assignment**: Assign multiple users to projects

### ✅ Task Management  
- **Task CRUD Operations**: Create, Read, Update, Delete tasks
- **Task Assignment**: Assign tasks to specific team members
- **Task Status Tracking**: Track tasks through their lifecycle (Pending → In Progress → Completed)
- **Priority Levels**: Set task priorities (Low, Medium, High)
- **Due Dates**: Set and track task deadlines
- **Todo Checklists**: Break tasks into subtasks with checkable items
- **File Attachments**: Attach files and images to tasks
- **Progress Tracking**: Automatic progress calculation based on checklist completion

### 👥 User Management
- **Role-Based Access Control**: Admin and Member roles
- **User Profiles**: Manage user information and profiles
- **Team Assignment**: Assign users to projects and tasks
- **Activity Tracking**: Track user task counts and performance

### 📊 Dashboard & Reports
- **Admin Dashboard**: Overview of all projects, tasks, and team performance
- **User Dashboard**: Personal task overview and statistics  
- **Task Statistics**: View task distribution by status and priority
- **Project Stats**: Track project completion and progress
- **Export Reports**: Export task and user reports to Excel

### 🔐 Authentication & Security
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Role-based access control
- **Password Hashing**: Secure password storage with bcrypt
- **Admin Token**: Special token for admin registration

---

## 📁 Project Structure

```
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js        # Authentication logic
│   │   ├── projectController.js     # Project CRUD operations
│   │   ├── taskController.js        # Task CRUD operations
│   │   ├── userController.js        # User management
│   │   └── reportController.js      # Export reports
│   ├── middlewares/
│   │   ├── authMiddleware.js        # JWT verification & role checking
│   │   └── uploadMiddleware.js      # File upload handling
│   ├── models/
│   │   ├── User.js                  # User schema
│   │   ├── Project.js               # Project schema
│   │   └── Task.js                  # Task schema
│   ├── routes/
│   │   ├── authRoutes.js            # Auth endpoints
│   │   ├── projectRoutes.js         # Project endpoints
│   │   ├── taskRoutes.js            # Task endpoints
│   │   ├── userRoutes.js            # User endpoints
│   │   └── reportRoutes.js          # Report endpoints
│   ├── uploads/                     # Uploaded files directory
│   ├── .env                         # Environment variables
│   ├── package.json
│   └── server.js                    # Express server
│
└── frontend/Task-Manager/
    ├── src/
    │   ├── components/
    │   │   ├── Sidebar.jsx          # Navigation sidebar
    │   │   └── ProjectCard.jsx      # Project card component
    │   ├── pages/
    │   │   ├── Admin/
    │   │   │   ├── Dashboard.jsx     # Admin dashboard
    │   │   │   ├── Projects.jsx      # Project list
    │   │   │   ├── ProjectDetails.jsx # Project details
    │   │   │   ├── ProjectForm.jsx   # Create/Edit project
    │   │   │   ├── ManageTask.jsx    # Task list
    │   │   │   ├── CreateTask.jsx    # Create/Edit task
    │   │   │   └── ManageUsers.jsx   # User management
    │   │   ├── Users/
    │   │   │   ├── UserDashboard.jsx # User dashboard
    │   │   │   ├── MyTasks.jsx       # User's tasks
    │   │   │   └── ViewTaskDetails.jsx # Task details
    │   │   └── Auth/
    │   │       ├── Login.jsx          # Login page
    │   │       └── SignUp.jsx         # Registration page
    │   ├── services/
    │   │   ├── projectService.js     # Project API calls
    │   │   └── taskService.js        # Task API calls
    │   ├── utils/
    │   │   ├── axiosInstance.js      # Axios configuration
    │   │   └── apiPaths.js           # API endpoints
    │   ├── App.jsx                    # Main app component
    │   └── main.jsx                   # React entry point
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

### 🔧 Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```env
   # Server Configuration
   PORT=5000
   
   # MongoDB Configuration
   MONGO_URI=mongodb://localhost:27017/task-manager
   
   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here
   
   # Admin Configuration
   ADMIN_INVITE_TOKEN=admin_secret_token_123
   
   # Client Configuration
   CLIENT_URL=http://localhost:5173
   ```

4. **Start the server:**
   ```bash
   npm start
   ```
   
   Server will run on `http://localhost:5000`

### 🎨 Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend/Task-Manager
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file** (if needed):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   Frontend will run on `http://localhost:5173`

---

## 📊 API Documentation

### 🔐 Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | User login | Public |
| GET | `/api/auth/profile` | Get user profile | Private |
| PUT | `/api/auth/profile` | Update profile | Private |

### 📁 Project Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/projects` | Get all projects | Private |
| GET | `/api/projects/:id` | Get project details | Private |
| POST | `/api/projects` | Create new project | Admin |
| PUT | `/api/projects/:id` | Update project | Admin |
| DELETE | `/api/projects/:id` | Delete project | Admin |
| GET | `/api/projects/:id/tasks` | Get project tasks | Private |
| GET | `/api/projects/:id/stats` | Get project statistics | Private |

### 📋 Task Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/tasks` | Get all tasks | Private |
| GET | `/api/tasks/:id` | Get task by ID | Private |
| POST | `/api/tasks` | Create new task | Admin |
| PUT | `/api/tasks/:id` | Update task | Private |
| DELETE | `/api/tasks/:id` | Delete task | Admin |
| PUT | `/api/tasks/:id/status` | Update task status | Private |
| PUT | `/api/tasks/:id/todo` | Update task checklist | Private |
| GET | `/api/tasks/dashboard-data` | Get dashboard data | Admin |
| GET | `/api/tasks/user-dashboard-data` | Get user dashboard | Private |

### 👥 User Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/users` | Get all users | Admin |
| GET | `/api/users/:id` | Get user by ID | Admin |

### 📊 Report Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/reports/export/tasks` | Export tasks to Excel | Admin |
| GET | `/api/reports/export/user` | Export user report | Private |

---

## 🔑 Environment Variables

### Backend (.env)

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | `5000` |
| `MONGO_URI` | MongoDB connection string | Yes | `mongodb://localhost:27017/task-manager` |
| `JWT_SECRET` | JWT signing secret | Yes | `your_secret_key` |
| `ADMIN_INVITE_TOKEN` | Token for admin registration | Yes | `admin_secret_123` |
| `CLIENT_URL` | Frontend URL for CORS | No | `http://localhost:5173` |

### Frontend (.env)

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API URL | No | `http://localhost:5000/api` |

---

## 🎯 Usage Guide

### Creating a Project (Admin Only)

1. **Login as Admin**
   - Use admin credentials
   - Navigate to **Projects** page

2. **Create New Project**
   - Click "New Project" button
   - Fill in project details:
     - Project name (required)
     - Description (required)
     - Start and end dates (required)
     - Priority (Low/Medium/High)
     - Budget
     - Status (Planning/Active/On-Hold/Completed/Cancelled)
   - Click "Create Project"

3. **Manage Project**
   - View project details
   - Edit project information
   - Track project progress
   - View all project tasks

### Creating Tasks (Admin Only)

1. **Navigate to Tasks**
   - Go to Tasks page OR
   - Click "Add Task" from a Project

2. **Fill Task Details**
   - **Project** (required) - Select the project
   - **Title** (required) - Task name
   - **Description** - Task details
   - **Priority** - Low/Medium/High
   - **Due Date** (required)
   - **Assign To** - Select team members
   - **Todo Checklist** - Add subtasks
   - **Attachments** - Upload files

3. **Task Status**
   - Tasks start as "Pending"
   - Update to "In-Progress" when working
   - Mark as "Completed" when done

### User Workflow

1. **Login** 
   - Use member credentials
   - View personal dashboard

2. **View Projects**
   - See all projects you're assigned to
   - View project details and tasks

3. **Manage Tasks**
   - View all your assigned tasks
   - Update task status
   - Check off todo items
   - View task details

---

## 🔐 User Roles & Permissions

### Admin Permissions
- ✅ Create, edit, delete projects
- ✅ Create, edit, delete tasks
- ✅ Assign tasks to users
- ✅ View all projects and tasks
- ✅ Manage users
- ✅ Export reports
- ✅ Access admin dashboard

### Member (User) Permissions
- ✅ View assigned projects
- ✅ View assigned tasks
- ✅ Update task status
- ✅ Update task checklists
- ✅ View task details
- ❌ Create/delete projects
- ❌ Create/delete tasks
- ❌ Manage users

---

## 📦 Key Dependencies

### Backend
- **express** - Web framework
- **mongoose** - MongoDB ODM
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **multer** - File upload handling
- **exceljs** - Excel report generation

### Frontend
- **react** - UI library
- **react-router-dom** - Routing
- **axios** - HTTP client
- **react-hot-toast** - Toast notifications
- **react-icons** - Icon library
- **moment** - Date formatting
- **recharts** - Charts and graphs
- **tailwindcss** - Utility-first CSS

---

## 🎨 UI Features

- **Modern Design** - Clean, professional interface
- **Responsive Layout** - Works on desktop, tablet, and mobile
- **Dark Sidebar** - Elegant navigation
- **Color-Coded Status** - Easy visual status identification
- **Real-time Updates** - Instant feedback on actions
- **Loading States** - Smooth loading indicators
- **Form Validation** - Client-side validation
- **Toast Notifications** - User-friendly alerts

---

## 🔐 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt encryption
- **Protected Routes** - Role-based access control
- **Input Validation** - Server-side validation
- **CORS Configuration** - Secure cross-origin requests
- **HTTP-Only Tokens** - Secure token storage

---

## 🚀 Deployment

### Backend Deployment (Render, Heroku, Railway, etc.)

1. Set environment variables on hosting platform
2. Update `MONGO_URI` to production MongoDB (MongoDB Atlas)
3. Set `CLIENT_URL` to production frontend URL
4. Deploy backend code

### Frontend Deployment (Vercel, Netlify, etc.)

1. Update `VITE_API_URL` to production backend URL
2. Build the project: `npm run build`
3. Deploy the `dist` folder

---

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Ensure MongoDB is running
- Check `MONGO_URI` in `.env`
- Verify network connectivity

**CORS Error**
- Set correct `CLIENT_URL` in backend `.env`
- Check frontend API URL configuration

**JWT Token Error**
- Clear browser local storage
- Re-login to get a new token

**Tasks Require Project Error**
- Ensure all tasks have a project assigned
- Check that project exists before creating tasks

---

## 📝 To-Do / Future Enhancements

- [ ] Real-time notifications (Socket.io)
- [ ] Email notifications
- [ ] Task comments and activity log
- [ ] File preview for attachments
- [ ] Drag-and-drop task management
- [ ] Calendar view for tasks
- [ ] Team chat/messaging
- [ ] Time tracking
- [ ] Project templates
- [ ] Advanced analytics dashboard

---

## 👨‍💻 Author

Created with ❤️ by [Your Name]

---

## 📄 License

This project is [MIT](LICENSE) licensed.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support

If you have any questions or need help, please open an issue in the repository.

---

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

**Happy Coding! 🚀**
