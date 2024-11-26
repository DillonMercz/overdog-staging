// pages/dashboard/BookmakersPage.tsx
import { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, 
  faExclamationCircle,
  faGlobe,
  faCheck
} from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../../lib/supabase/client';

interface Bookmaker {
  id: string;
  name: string;
  country: string;
  is_active: boolean;
  location: string;
}

const BookmakersPage = () => {
  const { profile, updateProfile } = useUser();
  const [bookmakers, setBookmakers] = useState<Bookmaker[]>([]);
  const [selectedBookmakers, setSelectedBookmakers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Fetch bookmakers from database
  useEffect(() => {
    const fetchBookmakers = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('bookmakers')
          .select('*')
          .eq('is_active', true)
          .order('name');

        if (fetchError) throw fetchError;
        setBookmakers(data);
      } catch (err) {
        console.error('Error fetching bookmakers:', err);
        setError('Failed to load bookmakers');
      } finally {
        setLoading(false);
      }
    };

    fetchBookmakers();
  }, []);

  // Load user's selected bookmakers
  useEffect(() => {
    if (profile?.selected_sportsbooks) {
      setSelectedBookmakers(Object.keys(profile.selected_sportsbooks));
    }
  }, [profile]);

  // Filter bookmakers based on user's location
  const getAvailableBookmakers = () => {
    if (!profile?.country) return bookmakers;
    
    // Map user's country to region
    const userRegion = profile.country === 'US' ? 'American' : 'Europe';
    return bookmakers.filter(bookie => bookie.location === userRegion);
  };

  const handleBookmakerToggle = (bookmakerId: string) => {
    setSelectedBookmakers(prev => 
      prev.includes(bookmakerId)
        ? prev.filter(id => id !== bookmakerId)
        : [...prev, bookmakerId]
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const bookmakerPreferences = selectedBookmakers.reduce((acc, id) => ({
        ...acc,
        [id]: { 
          selected: true, 
          selected_at: new Date().toISOString() 
        }
      }), {});

      await updateProfile({ selected_sportsbooks: bookmakerPreferences });
      setSuccess('Bookmaker preferences saved successfully');
    } catch (err) {
      console.error('Error saving bookmaker preferences:', err);
      setError('Failed to save bookmaker preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00F6FF]"></div>
          <p className="text-[#8F9BB3]">Loading bookmakers...</p>
        </div>
      </div>
    );
  }

  const availableBookmakers = getAvailableBookmakers();

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="rounded-xl bg-[rgba(255,255,255,0.03)] backdrop-blur-sm border border-[rgba(255,255,255,0.05)] p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">My Sportsbooks</h1>
            <p className="text-[#8F9BB3] mt-1">
              Select the sportsbooks you use for betting
              {profile?.country && ` available in ${profile.country}`}
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-[#00F6FF] text-black hover:bg-[#00D6DB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                Saving...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faCheck} />
                Save Preferences
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {(error || success) && (
        <div className={`rounded-xl p-4 flex items-center gap-3 ${
          error ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
        }`}>
          <FontAwesomeIcon icon={error ? faExclamationCircle : faCheckCircle} />
          <span>{error || success}</span>
        </div>
      )}

      {/* Location Warning */}
      {!profile?.country && (
        <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/20 p-4 flex items-center gap-3 text-yellow-500">
          <FontAwesomeIcon icon={faGlobe} />
          <span>Set your country in your profile to see sportsbooks available in your region</span>
        </div>
      )}

      {/* Bookmakers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableBookmakers.map(bookie => (
          <div
            key={bookie.id}
            className={`rounded-xl border p-4 transition-all cursor-pointer ${
              selectedBookmakers.includes(bookie.id)
                ? 'bg-[#00F6FF]/10 border-[#00F6FF]/30'
                : 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.05)]'
            }`}
            onClick={() => handleBookmakerToggle(bookie.id)}
          >
            <div className="flex items-start gap-4">
              <div className="relative w-12 h-12 flex-shrink-0 rounded-lg bg-[#13131A] flex items-center justify-center">
                <span className="text-lg font-medium text-white">
                  {bookie.name.charAt(0)}
                </span>
                {selectedBookmakers.includes(bookie.id) && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-[#00F6FF] rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-black" />
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-white font-medium">{bookie.name}</h3>
                <p className="text-[#8F9BB3] text-sm">
                  {bookie.country}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookmakersPage;
