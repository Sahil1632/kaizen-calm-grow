import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { session, loading } = useAuth();

  // Show nothing while loading to prevent flash
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check for guest mode (localStorage fallback)
  const isGuest = localStorage.getItem('kaizen-guest') === 'true';

  if (!session && !isGuest) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
