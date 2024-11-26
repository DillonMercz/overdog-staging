// App.tsx
import { HashRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { supabase } from './lib/supabase/client';
import { AppRoutes } from './routes/protected/AppRoutes';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <AuthProvider supabase={supabase}>
          <UserProvider>
            <AppRoutes />
          </UserProvider>
        </AuthProvider>
      </HashRouter>
    </ErrorBoundary>
  );
}

export default App;
