import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedPlans: string[];
}

export function RoleProtectedRoute({ children, allowedPlans }: RoleProtectedRouteProps) {
  const { profile } = useUser();
  const location = useLocation();

  if (!profile || !allowedPlans.includes(profile.plan)) {
    // Redirect to a default allowed page based on the user's plan
    let redirectPath = '/dashboard/profile';
    
    if (profile?.plan === 'Apprentice') {
      redirectPath = '/dashboard/nba';
    } else if (profile?.plan === 'Royal') {
      redirectPath = '/dashboard';
    }
    
    // Only redirect if we're not already on the target path
    if (location.pathname !== redirectPath) {
      return <Navigate to={redirectPath} replace />;
    }
  }

  return <>{children}</>;
}
