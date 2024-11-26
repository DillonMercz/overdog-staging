// components/DiscordCallback.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { supabase } from '../../lib/supabase/client';

export const DiscordCallback = () => {
  const navigate = useNavigate();
  const { profile } = useUser();

  useEffect(() => {
    const handleDiscordCallback = async () => {
      try {
        // Get code from URL
        const code = new URLSearchParams(window.location.search).get('code');
        if (!code) throw new Error('No code provided');

        // Exchange code for token
        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
          method: 'POST',
          body: new URLSearchParams({
            client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
            client_secret: import.meta.env.VITE_DISCORD_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code,
            redirect_uri: `${window.location.origin}/dashboard/profile/`
          }),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        });

        if (!tokenResponse.ok) {
          throw new Error('Failed to exchange code for token');
        }

        const tokens = await tokenResponse.json();

        // Get user data from Discord
        const userResponse = await fetch('https://discord.com/api/users/@me', {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`
          }
        });

        if (!userResponse.ok) {
          throw new Error('Failed to get Discord user data');
        }

        const userData = await userResponse.json();

        // Update the user's Discord info in Supabase
        if (profile?.id) {
          await supabase
            .from('users')
            .update({
              discord_user: JSON.stringify({
                id: userData.id,
                username: userData.username,
                discriminator: userData.discriminator,
                avatar: userData.avatar,
                connected_at: new Date().toISOString()
              })
            })
            .eq('id', profile.id);
        }

        navigate('/dashboard/profile');
      } catch (error) {
        console.error('Error connecting Discord:', error);
        navigate('/dashboard/profile?error=discord_connection_failed');
      }
    };

    handleDiscordCallback();
  }, [navigate, profile]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1E1E1E]">
      <div className="flex items-center space-x-3 text-white">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#5865F2]"></div>
        <span>Connecting Discord account...</span>
      </div>
    </div>
  );
};
