// routes/AppRoutes.tsx
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { UserProvider, useUser } from '../../contexts/UserContext';
import DashboardLayout from '../../pages/dashboard/DashBoardLayout';
import AuthPage from '../../pages/auth/AuthPage';

// Create a wrapper component for protected routes that need user profile data
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { profile, loading: profileLoading } = useUser();
  
  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1E1E1E]">
        <div className="flex items-center space-x-2 text-white">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    // Handle the case where we have auth but no profile
    // You might want to redirect to a profile setup page or show an error
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1E1E1E]">
        <div className="text-white">Profile not found. Please contact support.</div>
      </div>
    );
  }

  return <>{children}</>;
};

// The main routes component
export function AppRoutes() {
  const { user, loading: authLoading } = useAuthContext();
  const location = useLocation();

  // Show a loading indicator while checking auth status
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1E1E1E]">
        <div className="flex items-center space-x-2 text-white">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/auth"
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <AuthPage />
          )
        }
      />
      
      {/* Protected routes - wrap with UserProvider */}
      <Route
        path="/dashboard/*"
        element={
          user ? (
            <UserProvider>
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            </UserProvider>
          ) : (
            <Navigate to="/auth" state={{ from: location }} replace />
          )
        }
      />

      {/* Root redirect */}
      <Route
        path="/"
        element={
          <Navigate to={user ? "/dashboard" : "/auth"} replace />
        }
      />

      {/* Catch all route */}
      <Route
        path="*"
        element={
          <Navigate to={user ? "/dashboard" : "/auth"} replace />
        }
      />
    </Routes>
  );
}