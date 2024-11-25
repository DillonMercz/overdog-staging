import { useState, useEffect } from 'react';
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

const SUBSCRIPTION_TIERS = {
  commoner: {
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
  noble: {
    name: 'Noble',
    icon: fasCrown as IconProp,
    color: 'text-[#FFD700]',
    bgColor: 'bg-[#FFD700]/10',
    borderColor: 'border-[#FFD700]/20',
    features: [
      'Everything in Commoner',
      'Priority access to picks',
      'Discord role',
      'Priority support',
      'Exclusive chat rooms'
    ]
  },
  emperor: {
    name: 'Emperor',
    icon: fasGem as IconProp,
    color: 'text-[#00F6FF]',
    bgColor: 'bg-[#00F6FF]/10',
    borderColor: 'border-[#00F6FF]/20',
    features: [
      'Everything in Noble',
      'VIP Discord access',
      'Personal pick consultation',
      '24/7 Premium support',
      'Early access to new features',
      'Custom profile badge'
    ]
  }
};

const ProfilePage = () => {
  const { profile, loading, updateProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
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

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;
  const REDIRECT_URI = `${window.location.origin}/dashboard/profile/discord/callback`;

  useEffect(() => {
    if (profile?.discord_user) {
      try {
        setDiscordProfile(JSON.parse(profile.discord_user));
      } catch (err) {
        console.error('Error parsing Discord profile:', err);
      }
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00F6FF]"></div>
          <p className="text-[#8F9BB3]">Loading profile...</p>
        </div>
      </div>
    );
  }

  const currentTier = SUBSCRIPTION_TIERS[profile?.plan?.toLowerCase() as keyof typeof SUBSCRIPTION_TIERS] || SUBSCRIPTION_TIERS.commoner;

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError(null);
      const file = event.target.files?.[0];
      if (!file) return;

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
      const fileName = `${Math.random().toString(36).substring(2)}${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      setEditedData(prev => ({ ...prev, avatar: fileName }));
      setSuccess('Avatar updated successfully');
    } catch (err) {
      console.error('Error uploading avatar:', err);
      setError('Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleDiscordConnect = () => {
    const scope = 'identify';
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${scope}`;
    window.location.href = discordAuthUrl;
  };

  const handleDiscordDisconnect = async () => {
    try {
      setError(null);
      await updateProfile({ discord_user: null });
      setDiscordProfile(null);
      setSuccess('Discord account disconnected successfully');
    } catch (err) {
      console.error('Error disconnecting Discord:', err);
      setError('Failed to disconnect Discord account');
    }
  };

  const handleSave = async () => {
    try {
      setError(null);
      setSuccess(null);

      if (!editedData.username.trim()) {
        setError('Username is required');
        return;
      }

      if (!editedData.email.trim() || !/\S+@\S+\.\S+/.test(editedData.email)) {
        setError('Valid email is required');
        return;
      }

      if (!editedData.first_name.trim()) {
        setError('First name is required');
        return;
      }

      if (!editedData.last_name.trim()) {
        setError('Last name is required');
        return;
      }

      if (!editedData.country) {
        setError('Please select your country');
        return;
      }

      if (!editedData.birthday) {
        setError('Please enter your birthday');
        return;
      }

      if (new Date(editedData.birthday) > new Date()) {
        setError('Birthday cannot be in the future');
        return;
      }

      const age = new Date().getFullYear() - new Date(editedData.birthday).getFullYear();
      if (age < 18) {
        setError('You must be at least 18 years old');
        return;
      }

      await updateProfile(editedData);
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="rounded-xl bg-[rgba(255,255,255,0.03)] backdrop-blur-sm border border-[rgba(255,255,255,0.05)] p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
            <p className="text-[#8F9BB3] mt-1">Manage your account preferences and connections</p>
          </div>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors ${
              isEditing 
                ? 'bg-[#00F6FF] text-black hover:bg-[#00D6DB]' 
                : 'bg-[rgba(255,255,255,0.03)] text-white hover:bg-[rgba(255,255,255,0.06)]'
            }`}
          >
            <FontAwesomeIcon icon={isEditing ? fasSave as IconProp : fasEdit as IconProp} />
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {(error || success) && (
        <div className={`rounded-xl p-4 flex items-center gap-3 ${
          error ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
        }`}>
          <FontAwesomeIcon icon={(error ? fasExclamationCircle : fasCheckCircle) as IconProp} />
          <span>{error || success}</span>
        </div>
      )}

      <div className="rounded-xl bg-[rgba(255,255,255,0.03)] backdrop-blur-sm border border-[rgba(255,255,255,0.05)] p-6">
        <div className="space-y-8">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={`${supabaseUrl}/storage/v1/object/public/profiles/avatars/${editedData.avatar}`}
                alt="Profile"
                className="w-24 h-24 rounded-xl object-cover bg-[#13131A]"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 p-2 bg-[#00F6FF] rounded-full cursor-pointer hover:bg-[#00D6DB] transition-colors">
                  <FontAwesomeIcon icon={fasCamera as IconProp} className="text-black w-4 h-4" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={uploadingAvatar}
                  />
                </label>
              )}
            </div>
            <div>
              <h3 className="text-white font-medium">{profile?.username || 'Username'}</h3>
              <p className="text-[#8F9BB3] text-sm">{profile?.email}</p>
              {uploadingAvatar && (
                <p className="text-[#8F9BB3] text-sm mt-2">Uploading avatar...</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#8F9BB3] mb-2">
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.first_name}
                    onChange={(e) => setEditedData(prev => ({ ...prev, first_name: e.target.value }))}
                    className="w-full px-4 py-2 bg-[#13131A] rounded-xl border border-[rgba(255,255,255,0.05)] text-white focus:outline-none focus:ring-2 focus:ring-[#00F6FF]/15"
                    placeholder="Enter your first name"
                  />
                ) : (
                  <p className="text-white px-4 py-2">{profile?.first_name || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#8F9BB3] mb-2">
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.last_name}
                    onChange={(e) => setEditedData(prev => ({ ...prev, last_name: e.target.value }))}
                    className="w-full px-4 py-2 bg-[#13131A] rounded-xl border border-[rgba(255,255,255,0.05)] text-white focus:outline-none focus:ring-2 focus:ring-[#00F6FF]/15"
                    placeholder="Enter your last name"
                  />
                ) : (
                  <p className="text-white px-4 py-2">{profile?.last_name || 'Not set'}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#8F9BB3] mb-2">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedData.email}
                    onChange={(e) => setEditedData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2 bg-[#13131A] rounded-xl border border-[rgba(255,255,255,0.05)] text-white focus:outline-none focus:ring-2 focus:ring-[#00F6FF]/15"
                    placeholder="Enter your email"
                  />
                ) : (
                  <p className="text-white px-4 py-2">{profile?.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#8F9BB3] mb-2">
                  Username
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.username}
                    onChange={(e) => setEditedData(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full px-4 py-2 bg-[#13131A] rounded-xl border border-[rgba(255,255,255,0.05)] text-white focus:outline-none focus:ring-2 focus:ring-[#00F6FF]/15"
                    placeholder="Choose a username"
                  />
                ) : (
                  <p className="text-white px-4 py-2">{profile?.username}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#8F9BB3] mb-2">
                  Country
                </label>
                {isEditing ? (
                  <select
                    value={editedData.country}
                    onChange={(e) => setEditedData(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full px-4 py-2 bg-[#13131A] rounded-xl border border-[rgba(255,255,255,0.05)] text-white focus:outline-none focus:ring-2 focus:ring-[#00F6FF]/15"
                  >
                    <option value="">Select a country</option>
                    {Object.entries(countries).map(([code, country]) => (
                      <option key={code} value={code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-white px-4 py-2">
                    {profile?.country ? countries[profile.country as keyof typeof countries]?.name : 'Not set'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#8F9BB3] mb-2">
                  Birthday
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editedData.birthday}
                    onChange={(e) => setEditedData(prev => ({ ...prev, birthday: e.target.value }))}
                    className="w-full px-4 py-2 bg-[#13131A] rounded-xl border border-[rgba(255,255,255,0.05)] text-white focus:outline-none focus:ring-2 focus:ring-[#00F6FF]/15"
                    max={new Date().toISOString().split('T')[0]}
                  />
                ) : (
                  <p className="text-white px-4 py-2">
                    {profile?.birthday 
                      ? new Date(profile.birthday).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'Not set'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-[rgba(255,255,255,0.03)] backdrop-blur-sm border border-[rgba(255,255,255,0.05)] p-6">
        <h3 className="text-lg font-medium text-white mb-6">Current Subscription</h3>
        
        <div className={`rounded-xl border ${currentTier.borderColor} p-6 ${currentTier.bgColor}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${currentTier.bgColor} flex items-center justify-center`}>
                <FontAwesomeIcon icon={currentTier.icon} className={`w-6 h-6 ${currentTier.color}`} />
              </div>
              
              <div>
                <h4 className={`text-lg font-medium ${currentTier.color}`}>
                  {currentTier.name}
                </h4>
                <p className="text-[#8F9BB3] text-sm">
                  Your current subscription plan
                </p>
              </div>
            </div>

            <button 
              className="px-4 py-2 rounded-xl bg-[#00F6FF] text-black hover:bg-[#00D6DB] transition-colors text-sm"
              onClick={() => {/* Handle upgrade click */}}
            >
              Upgrade Plan
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentTier.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-[#8F9BB3]">
                <div className={`w-1.5 h-1.5 rounded-full ${currentTier.color}`} />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium text-white mb-6">Connected Accounts</h3>
          
          <div className="bg-[#13131A] rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-[#5865F2] flex items-center justify-center">
                  <FontAwesomeIcon icon={fabDiscord as IconProp} className="w-6 h-6 text-white" />
                </div>
                
                <div>
                  <h4 className="text-white font-medium">Discord</h4>
                  {discordProfile ? (
                    <p className="text-[#8F9BB3] text-sm">
                      Connected as {discordProfile.username}#{discordProfile.discriminator}
                    </p>
                  ) : (
                    <p className="text-[#8F9BB3] text-sm">
                      Link your Discord account
                    </p>
                  )}
                </div>
              </div>

              {discordProfile ? (
                <button
                  onClick={handleDiscordDisconnect}
                  className="px-4 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={fasUnlink as IconProp} />
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={handleDiscordConnect}
                  className="px-4 py-2 rounded-xl bg-[#5865F2] text-white hover:bg-[#4752C4] transition-colors flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={fabDiscord as IconProp} />
                  Connect Discord
                </button>
              )}
            </div>

            {discordProfile && (
              <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.05)]">
                <div className="flex items-center space-x-3">
                  <img
                    src={`https://cdn.discordapp.com/avatars/${discordProfile.id}/${discordProfile.avatar}`}
                    alt="Discord Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="text-white text-sm">
                      {discordProfile.username}#{discordProfile.discriminator}
                    </p>
                    <p className="text-[#8F9BB3] text-xs">
                      Connected {new Date(discordProfile.connected_at || '').toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => {
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
            }}
            className="px-4 py-2 rounded-xl text-[#8F9BB3] hover:text-white transition-colors"
          >
            <FontAwesomeIcon icon={fasXmark as IconProp} className="mr-2" />
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;