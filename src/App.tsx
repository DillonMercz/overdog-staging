// App.tsx
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { supabase } from './lib/supabase/client';
import { AppRoutes } from './routes/protected/AppRoutes';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  // Check if we're on GitHub Pages
  const isGitHubPages = window.location.hostname.includes('github.io');
  const basename = isGitHubPages ? '/ODWebsitev2' : '';

  return (
    <ErrorBoundary>
      <BrowserRouter basename={basename}>
        <AuthProvider supabase={supabase}>
          <UserProvider>
            <AppRoutes />
          </UserProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
