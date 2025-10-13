import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const AppLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // while we're resolving auth (e.g., page refresh), don't redirect — show nothing or a loader
  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="p-6 animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
