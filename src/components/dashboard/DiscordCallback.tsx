import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase/client';
import { useUser } from '../../contexts/UserContext';

const DiscordCallback = () => {
  const navigate = useNavigate();
  const { refreshProfile } = useUser();
  const hasAttempted = useRef(false); // Add this to track if we've already tried

  useEffect(() => {
    const handleDiscordCallback = async () => {
      // If we've already tried, don't try again
      if (hasAttempted.current) return;
      hasAttempted.current = true;

      try {
        const code = new URLSearchParams(window.location.search).get('code');
        if (!code) throw new Error('No code provided');

        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
            client_secret: import.meta.env.VITE_DISCORD_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code,
            redirect_uri: `${window.location.origin}/dashboard/profile/discord/callback`,
          }),
        });

        if (!tokenResponse.ok) throw new Error('Failed to exchange code for token');
        const tokenData = await tokenResponse.json();

        const userResponse = await fetch('https://discord.com/api/users/@me', {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        });

        if (!userResponse.ok) throw new Error('Failed to fetch user data');
        const userData = await userResponse.json();

        // In your DiscordCallback component, after getting the user data:
        const guildId = import.meta.env.VITE_DISCORD_GUILD_ID;
        await fetch(`https://discord.com/api/guilds/${guildId}/members/${userData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            access_token: tokenData.access_token
          })
        });

        const { error: updateError } = await supabase
          .from('users')
          .update({
            discord_user: JSON.stringify({
              id: userData.id,
              username: userData.username,
              discriminator: userData.discriminator,
              avatar: userData.avatar,
              connected_at: new Date().toISOString(),
            }),
          })
          .eq('id', (await supabase.auth.getUser()).data.user?.id);

        if (updateError) throw updateError;

        await refreshProfile();
        navigate('/dashboard/profile', { replace: true });
      } catch (err) {
        console.error('Error connecting Discord:', err);
        navigate('/dashboard/profile?error=discord-connection-failed', { replace: true });
      }
    };

    handleDiscordCallback();
  }, [navigate, refreshProfile]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-white">Connecting Discord account...</div>
    </div>
  );
};

export default DiscordCallback;