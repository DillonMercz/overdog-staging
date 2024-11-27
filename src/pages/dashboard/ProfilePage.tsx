import { useState, useEffect, useCallback } from 'react';
import { useUser } from '../../contexts/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEdit as fasEdit, 
  faSave as fasSave, 
  faXmark as fasXmark, 
  faCamera as fasCamera,
  faUnlink as fasUnlink,
  faExclamationCircle as fasExclamationCircle,
  faCheckCircle as fasCheckCircle,
  faCrown as fasCrown,
  faGem as fasGem,
  faUser as fasUser
} from '@fortawesome/free-solid-svg-icons';
import { faDiscord as fabDiscord } from '@fortawesome/free-brands-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { countries } from 'countries-list';
import { supabase } from '../../lib/supabase/client';


interface DiscordProfile {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  connected_at?: string;
}

interface EditedData {
  email: string;
  username: string;
  avatar: string;
  first_name: string;
  last_name: string;
  country: string;
  birthday: string;
}

const SUBSCRIPTION_TIERS = {
  Commoner: {
    name: 'Commoner',
    icon: fasUser as IconProp,
    color: 'text-gray-400',
    bgColor: 'bg-gray-400/10',
    borderColor: 'border-gray-400/20',
    features: [
      'Basic access to picks',
      'Community chat access',
      'Standard support'
    ]
  },
  Apprentice: {
    name: 'Apprentice',
    icon: fasCrown as IconProp,
    color: 'text-[#FFD700]',
    bgColor: 'bg-[#FFD700]/10',
    borderColor: 'border-[#FFD700]/20',
    features: [
      'Everything in Commoner',
      'Priority access to picks',
      'Apprentice Discord role',
      'Priority support',
      'Exclusive chat rooms'
    ]
  },
  Royal: {
    name: 'Royal',
    icon: fasGem as IconProp,
    color: 'text-[#00F6FF]',
    bgColor: 'bg-[#00F6FF]/10',
    borderColor: 'border-[#00F6FF]/20',
    features: [
      'Everything in Apprentice',
      'Royal Discord role',
      'Personal pick consultation',
      '24/7 Premium support',
      'Early access to new features',
      'Custom profile badge'
    ]
  }
};

const ProfilePage = () => {
  const { profile, refreshProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<EditedData>({
    email: profile?.email || '',
    username: profile?.username || '',
    avatar: profile?.avatar || '',
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    country: profile?.country || '',
    birthday: profile?.birthday || ''
  });
  const [discordProfile, setDiscordProfile] = useState<DiscordProfile | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;

  // In ProfilePage.tsx, modify the initial effect:
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const error = searchParams.get('error');
    if (error === 'discord-connection-failed') {
      setError('Failed to connect Discord account');
    }
    // Only refresh on mount, not on every render
  }, []); // Empty dependency array

  // Add a separate effect for profile updates
  useEffect(() => {
    if (profile) {
      setEditedData({
        email: profile.email || '',
        username: profile.username || '',
        avatar: profile.avatar || '',
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        country: profile.country || '',
        birthday: profile.birthday || ''
      });
    }
  }, [profile]); // Only depend on profile changes

  // Update Discord profile when profile changes
  useEffect(() => {
    if (profile?.discord_user) {
      try {
        const parsed = JSON.parse(profile.discord_user);
        setDiscordProfile(parsed);
      } catch (err) {
        console.error('Error parsing Discord profile:', err);
        setDiscordProfile(null);
      }
    } else {
      setDiscordProfile(null);
    }
  }, [profile?.discord_user]);

  // Get avatar URL
  const getAvatarUrl = useCallback(async (path: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('avatars')
        .createSignedUrl(path, 3600);

      if (error) throw error;
      return data.signedUrl;
    } catch (err) {
      console.error('Error getting avatar URL:', err);
      return '';
    }
  }, []);

  // Update avatar URL when avatar changes
  useEffect(() => {
    const updateAvatarUrl = async () => {
      if (!editedData.avatar) {
        setAvatarUrl('');
        return;
      }
      const url = await getAvatarUrl(editedData.avatar);
      setAvatarUrl(url);
    };

    updateAvatarUrl();
  }, [editedData.avatar, getAvatarUrl]);

  const getDiscordAvatar = (profile: DiscordProfile) => {
    return profile.avatar 
      ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
      : `https://cdn.discordapp.com/embed/avatars/${parseInt(profile.discriminator) % 5}.png`;
  };

  const handleDiscordConnect = () => {
    // Make sure DISCORD_CLIENT_ID matches your application's client ID
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize` + 
      `?client_id=${DISCORD_CLIENT_ID}` +
      `&scope=identify%20guilds.join%20role_connections.write` +
      `&response_type=code` +
      `&permissions=1099511627775` + // Adding permissions to ensure role access
      `&prompt=consent` + // Force consent screen to ensure fresh token
      `&redirect_uri=${encodeURIComponent(`${window.location.origin}/dashboard/profile/discord/callback`)}`;
      
    window.location.href = discordAuthUrl;
  };

  const handleDiscordDisconnect = async () => {
    try {
      setError(null);
      const { error: disconnectError } = await supabase
        .from('users')
        .update({
          discord_user: null
        })
        .eq('id', profile?.id);

      if (disconnectError) throw disconnectError;

      await refreshProfile();
      setDiscordProfile(null);
      setSuccess('Discord account disconnected successfully');
    } catch (err) {
      console.error('Error disconnecting Discord:', err);
      setError('Failed to disconnect Discord account');
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError(null);
      const file = event.target.files?.[0];
      if (!file || !profile?.id) return;

      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setUploadingAvatar(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}/${Math.random().toString(36).substring(2)}${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      if (editedData.avatar) {
        await supabase.storage
          .from('avatars')
          .remove([editedData.avatar]);
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar: fileName })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      setEditedData(prev => ({ ...prev, avatar: fileName }));
      await refreshProfile();
      setSuccess('Avatar updated successfully');
    } catch (err) {
      console.error('Error uploading avatar:', err);
      setError('Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const validateForm = () => {
    if (!editedData.username.trim()) {
      setError('Username is required');
      return false;
    }

    if (!editedData.email.trim() || !/\S+@\S+\.\S+/.test(editedData.email)) {
      setError('Valid email is required');
      return false;
    }

    if (!editedData.first_name.trim()) {
      setError('First name is required');
      return false;
    }

    if (!editedData.last_name.trim()) {
      setError('Last name is required');
      return false;
    }

    if (!editedData.country) {
      setError('Please select your country');
      return false;
    }

    if (!editedData.birthday) {
      setError('Please enter your birthday');
      return false;
    }

    const birthDate = new Date(editedData.birthday);
    if (birthDate > new Date()) {
      setError('Birthday cannot be in the future');
      return false;
    }

    const age = new Date().getFullYear() - birthDate.getFullYear();
    if (age < 18) {
      setError('You must be at least 18 years old');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    try {
      setError(null);
      setSuccess(null);

      if (!validateForm()) return;

      const { error: updateError } = await supabase
        .from('users')
        .update(editedData)
        .eq('id', profile?.id);

      if (updateError) throw updateError;

      await refreshProfile();
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({
      email: profile?.email || '',
      username: profile?.username || '',
      avatar: profile?.avatar || '',
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      country: profile?.country || '',
      birthday: profile?.birthday || ''
    });
    setError(null);
  };

  const getCurrentTier = () => {
    const tier = profile?.plan || 'Commoner';
    return SUBSCRIPTION_TIERS[tier as keyof typeof SUBSCRIPTION_TIERS] || SUBSCRIPTION_TIERS.Commoner;
  };

  const currentTier = getCurrentTier();

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Profile header */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-[#8F9BB3]">Dashboard /</span>
        <span className="text-white font-medium">Profile</span>
      </div>

      {/* Main content */}
      <div className="bg-[rgba(255,255,255,0.03)] backdrop-blur-sm border border-[rgba(255,255,255,0.05)] rounded-2xl p-6">
        {error && (
          <div className="mb-4 flex items-center gap-2 text-[#FF3D71] bg-[rgba(255,61,113,0.15)] border border-[rgba(255,255,255,0.05)] rounded-lg p-3">
            <FontAwesomeIcon icon={fasExclamationCircle as IconProp} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-4 flex items-center gap-2 text-[#00E096] bg-[rgba(0,224,150,0.15)] border border-[rgba(255,255,255,0.05)] rounded-lg p-3">
            <FontAwesomeIcon icon={fasCheckCircle as IconProp} />
            <span>{success}</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Avatar section */}
          <div className="flex items-start gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-[rgba(255,255,255,0.05)] overflow-hidden">
                {editedData.avatar && avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={() => {
                      setAvatarUrl('');
                      setEditedData(prev => ({ ...prev, avatar: '' }));
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#8F9BB3]">
                    <FontAwesomeIcon icon={fasUser as IconProp} size="2x" />
                  </div>
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-[#00F6FF] rounded-full flex items-center justify-center cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={uploadingAvatar}
                  />
                  <FontAwesomeIcon 
                    icon={fasCamera as IconProp}
                    className="text-black"
                  />
                </label>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    {profile?.first_name} {profile?.last_name}
                  </h2>
                  <p className="text-[#8F9BB3]">@{profile?.username}</p>
                </div>
                <button
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                >
                  <FontAwesomeIcon 
                    icon={isEditing ? (fasSave as IconProp) : (fasEdit as IconProp)}
                    className="text-[#00F6FF]"
                  />
                  <span className="text-white">
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                  </span>
                </button>
              </div><div className={`mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${currentTier.bgColor} ${currentTier.borderColor} border`}>
                <FontAwesomeIcon 
                  icon={currentTier.icon}
                  className={currentTier.color}
                />
                <span className={`text-sm font-medium ${currentTier.color}`}>
                  {currentTier.name}
                </span>
              </div>
            </div>
          </div>

          {/* Form fields */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[#8F9BB3] text-sm mb-2">
                Email
              </label>
              <input
                type="email"
                value={editedData.email}
                onChange={(e) => setEditedData(prev => ({ ...prev, email: e.target.value }))}
                disabled={!isEditing}
                className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.05)] rounded-lg px-4 py-2.5 text-white placeholder-[#8F9BB3] disabled:opacity-50"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-[#8F9BB3] text-sm mb-2">
                Username
              </label>
              <input
                type="text"
                value={editedData.username}
                onChange={(e) => setEditedData(prev => ({ ...prev, username: e.target.value }))}
                disabled={!isEditing}
                className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.05)] rounded-lg px-4 py-2.5 text-white placeholder-[#8F9BB3] disabled:opacity-50"
                placeholder="Choose a username"
              />
            </div>

            <div>
              <label className="block text-[#8F9BB3] text-sm mb-2">
                First Name
              </label>
              <input
                type="text"
                value={editedData.first_name}
                onChange={(e) => setEditedData(prev => ({ ...prev, first_name: e.target.value }))}
                disabled={!isEditing}
                className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.05)] rounded-lg px-4 py-2.5 text-white placeholder-[#8F9BB3] disabled:opacity-50"
                placeholder="Enter your first name"
              />
            </div>

            <div>
              <label className="block text-[#8F9BB3] text-sm mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={editedData.last_name}
                onChange={(e) => setEditedData(prev => ({ ...prev, last_name: e.target.value }))}
                disabled={!isEditing}
                className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.05)] rounded-lg px-4 py-2.5 text-white placeholder-[#8F9BB3] disabled:opacity-50"
                placeholder="Enter your last name"
              />
            </div>

            <div>
              <label className="block text-[#8F9BB3] text-sm mb-2">
                Country
              </label>
              <select
                value={editedData.country}
                onChange={(e) => setEditedData(prev => ({ ...prev, country: e.target.value }))}
                disabled={!isEditing}
                className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.05)] rounded-lg px-4 py-2.5 text-white placeholder-[#8F9BB3] disabled:opacity-50"
              >
                <option value="">Select your country</option>
                {Object.entries(countries).map(([code, country]) => (
                  <option key={code} value={code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#8F9BB3] text-sm mb-2">
                Birthday
              </label>
              <input
                type="date"
                value={editedData.birthday}
                onChange={(e) => setEditedData(prev => ({ ...prev, birthday: e.target.value }))}
                disabled={!isEditing}
                className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.05)] rounded-lg px-4 py-2.5 text-white placeholder-[#8F9BB3] disabled:opacity-50"
              />
            </div>
          </div>

          {/* Discord connection */}
          <div className="pt-6 border-t border-[rgba(255,255,255,0.05)]">
            <h3 className="text-lg font-semibold text-white mb-4">
              Connected Accounts
            </h3>
            
            <div className="flex items-center justify-between p-4 bg-[rgba(255,255,255,0.03)] rounded-lg">
              <div className="flex items-center gap-3">
                {discordProfile?.avatar ? (
                  <img 
                    src={getDiscordAvatar(discordProfile)}
                    alt="Discord Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <FontAwesomeIcon 
                    icon={fabDiscord as IconProp}
                    className="text-[#5865F2] text-xl"
                  />
                )}
                <div>
                  <h4 className="text-white font-medium">Discord</h4>
                  {discordProfile ? (
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-[#8F9BB3]">
                        {discordProfile.username}
                        <span className="opacity-50">#{discordProfile.discriminator}</span>
                      </p>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-[#5865F2]/20 text-[#5865F2]">
                        Connected {new Date(discordProfile.connected_at || '').toLocaleDateString()}
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm text-[#8F9BB3]">
                      Not connected
                    </p>
                  )}
                </div>
              </div>
              
              {discordProfile ? (
                <button
                  onClick={handleDiscordDisconnect}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgba(255,61,113,0.15)] hover:bg-[rgba(255,61,113,0.25)] transition-colors text-[#FF3D71]"
                >
                  <FontAwesomeIcon icon={fasUnlink as IconProp} />
                  <span>Disconnect</span>
                </button>
              ) : (
                <button
                  onClick={handleDiscordConnect}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#5865F2] hover:bg-[#4752C4] transition-colors text-white"
                >
                  <FontAwesomeIcon icon={fabDiscord as IconProp} />
                  <span>Connect Discord</span>
                </button>
              )}
            </div>
          </div>

          {/* Cancel button when editing */}
          {isEditing && (
            <div className="flex justify-end">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgba(255,61,113,0.15)] hover:bg-[rgba(255,61,113,0.25)] transition-colors text-[#FF3D71]"
              >
                <FontAwesomeIcon icon={fasXmark as IconProp} />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;