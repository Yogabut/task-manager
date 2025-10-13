import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="text-center space-y-6 max-w-md">
        <div className="gradient-indigo rounded-3xl w-32 h-32 flex items-center justify-center mx-auto shadow-xl">
          <span className="text-6xl font-bold text-white">404</span>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Page Not Found</h1>
          <p className="text-muted-foreground text-lg">
            Oops! The page you're looking for doesn't exist.
          </p>
        </div>

        <div className="flex items-center justify-center space-x-4 pt-4">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          <Button
            onClick={() => navigate('/')}
            className="gradient-indigo text-white rounded-xl hover:scale-105 transition-transform"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
