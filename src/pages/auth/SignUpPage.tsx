// pages/auth/SignInPage.tsx
import AuthPage from '../../components/auth/AuthPage';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { useEffect } from 'react';

export default function SignUpPage() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  return <AuthPage isSignIn={false} />;
}