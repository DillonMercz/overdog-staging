// App.tsx
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';  // Add this import
import { supabase } from './lib/supabase/client';
import { AppRoutes } from './routes/protected/AppRoutes';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider supabase={supabase}>
          <UserProvider>  {/* Add this wrapper */}
            <AppRoutes />
          </UserProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;