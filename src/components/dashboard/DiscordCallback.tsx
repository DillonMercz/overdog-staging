// components/DiscordCallback.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { supabase } from '../../lib/supabase/client';

const GUILD_ID = '1177360730543095939';
const ROLE_IDS = {
  commoner: '1310682572501684254',
  royal: '1310682612292915220',
  apprentice: '1310682772234436720'
};

export const DiscordCallback = () => {
  const navigate = useNavigate();
  const { updateProfile, profile } = useUser();

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
            access_token: tokens.access_token,
            connected_at: new Date().toISOString()
          })
        });

        // Add user to guild with appropriate role based on their plan
        if (profile?.plan && ROLE_IDS[profile.plan as keyof typeof ROLE_IDS]) {
          try {
            await fetch(
              `https://discord.com/api/v10/guilds/${GUILD_ID}/members/${userData.id}`,
              {
                method: 'PUT',
                headers: {
                  Authorization: `Bearer ${tokens.access_token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  access_token: tokens.access_token,
                  roles: [ROLE_IDS[profile.plan as keyof typeof ROLE_IDS]]
                })
              }
            );
          } catch (roleError) {
            console.error('Error assigning Discord role:', roleError);
            // Continue with the flow even if role assignment fails
          }
        }

        navigate('/dashboard/profile');
      } catch (error) {
        console.error('Discord auth error:', error);
        navigate('/dashboard/profile?error=discord_auth_failed');
      }
    };

    handleDiscordCallback();
  }, [navigate, updateProfile, profile]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1E1E1E]">
      <div className="flex items-center space-x-3 text-white">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#5865F2]"></div>
        <span>Connecting Discord account...</span>
      </div>
    </div>
  );
};


