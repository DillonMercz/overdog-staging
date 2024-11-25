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
  apprentice: {
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
  royal: {
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
    const scope = 'identify guilds.members.write';
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
      {/* Rest of the JSX remains exactly the same... */}
    </div>
  );
};
