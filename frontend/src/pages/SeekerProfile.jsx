import { useState, useEffect } from 'react';
import { User, Briefcase, FileText, Globe, Bell, Save, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function SeekerProfile() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    resumeUrl: '',
    skills: '',
    portfolioUrl: '',
    experienceYears: 0,
    alertsEnabled: false
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/seeker-profile/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/seeker-profile/${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      if (res.ok) {
        alert(t('profile_updated') || 'Profile successfully updated!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-10 text-center">{t('loading')}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header/Cover */}
        <div className="h-32 bg-gradient-to-r from-green-500 to-teal-600 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center border-4 border-white overflow-hidden">
              <User className="w-12 h-12 text-teal-600" />
            </div>
          </div>
        </div>

        <div className="pt-16 pb-8 px-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name || t('job_seeker')}</h1>
              <p className="text-gray-500 flex items-center gap-1 mt-1">
                <Briefcase className="w-4 h-4" /> {user.occupation || t('no_occupation')}
              </p>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
              <input 
                value={profile.skills || ''}
                onChange={e => setProfile({...profile, skills: e.target.value})}
                type="text" 
                className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500" 
                placeholder="e.g. Driving, Customer Service, Cleaning"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
              <input 
                value={profile.experienceYears || ''}
                onChange={e => setProfile({...profile, experienceYears: e.target.value})}
                type="number" 
                min="0"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500" 
                placeholder="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resume Link (G-Drive, Dropbox, etc)</label>
              <div className="relative">
                <FileText className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <input 
                  value={profile.resumeUrl || ''}
                  onChange={e => setProfile({...profile, resumeUrl: e.target.value})}
                  type="url" 
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500" 
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio or Profile URL</label>
              <div className="relative">
                <Globe className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <input 
                  value={profile.portfolioUrl || ''}
                  onChange={e => setProfile({...profile, portfolioUrl: e.target.value})}
                  type="url" 
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500" 
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="md:col-span-2 flex items-center gap-3 p-4 bg-teal-50 rounded-xl border border-teal-100">
              <Bell className="w-6 h-6 text-teal-600" />
              <div className="flex-1">
                <h3 className="font-bold text-teal-900">Job Alerts</h3>
                <p className="text-xs text-teal-700">Receive Push/Email matched notifications as soon as new jobs are posted.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={profile.alertsEnabled}
                  onChange={e => {
                    const enabled = e.target.checked;
                    setProfile({...profile, alertsEnabled: enabled});
                    if (enabled) {
                      alert("Simulated: You will now receive Push/Email alerts for matched jobs!");
                    }
                  }}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
              </label>
            </div>
            
            <div className="md:col-span-2 pt-6 border-t border-gray-100">
              <button 
                type="submit"
                className="bg-teal-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-teal-500/30 hover:bg-teal-700 transition flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> {t('save_details') || 'Save Details'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
