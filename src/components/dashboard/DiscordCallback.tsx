// components/DiscordCallback.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { supabase } from '../../lib/supabase/client';

export const DiscordCallback = () => {
  const navigate = useNavigate();
  const { updateProfile } = useUser();

  useEffect(() => {
    const handleDiscordCallback = async () => {
      try {
        // Get code from URL
        const code = new URLSearchParams(window.location.search).get('code');
        if (!code) throw new Error('No code provided');

        // Exchange code for token directly through Discord
        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
          method: 'POST',
          body: new URLSearchParams({
            client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
            client_secret: import.meta.env.VITE_DISCORD_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code,
            redirect_uri: `${window.location.origin}/dashboard/profile/discord/callback`
          }),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        });

        const tokens = await tokenResponse.json();

        // Get user data from Discord
        const userResponse = await fetch('https://discord.com/api/users/@me', {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`
          }
        });

        const userData = await userResponse.json();

        // Update profile in Supabase
        await updateProfile({
          discord_user: JSON.stringify({
            id: userData.id,
            username: userData.username,
            discriminator: userData.discriminator,
            avatar: userData.avatar,
            connected_at: new Date().toISOString()
          })
        });

        navigate('/dashboard/profile');
      } catch (error) {
        console.error('Discord auth error:', error);
        navigate('/dashboard/profile?error=discord_auth_failed');
      }
    };

    handleDiscordCallback();
  }, [navigate, updateProfile]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1E1E1E]">
      <div className="flex items-center space-x-3 text-white">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#5865F2]"></div>
        <span>Connecting Discord account...</span>
      </div>
    </div>
  );
};