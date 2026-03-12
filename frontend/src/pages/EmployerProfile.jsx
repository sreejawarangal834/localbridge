import { useState, useEffect } from 'react';
import { Building2, MapPin, Globe, Phone, Mail, Camera, Save, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function EmployerProfile() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    shopName: '',
    industry: 'Retail',
    location: '',
    website: '',
    description: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/profiles/${user.id}`);
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
      const res = await fetch(`http://localhost:5000/api/profiles/${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      if (res.ok) {
        alert(t('profile_updated'));
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
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center border-4 border-white overflow-hidden">
              <Building2 className="w-12 h-12 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="pt-16 pb-8 px-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile.shopName || t('your_business')}</h1>
              <p className="text-gray-500 flex items-center gap-1 mt-1">
                <MapPin className="w-4 h-4" /> {profile.location || t('location_not_set')}
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold border border-green-100">
              <ShieldCheck className="w-3 h-3" /> {t('verified_partner')}
            </div>
          </div>

          <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('shop_business_name')}</label>
              <input 
                value={profile.shopName}
                onChange={e => setProfile({...profile, shopName: e.target.value})}
                type="text" 
                className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder={t('shop_name_placeholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('industry_type')}</label>
              <select 
                value={profile.industry}
                onChange={e => setProfile({...profile, industry: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Retail">{t('retail')}</option>
                <option value="Medical">{t('medical')}</option>
                <option value="Restaurant">{t('restaurant')}</option>
                <option value="Logistics">{t('logistics')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('full_address')}</label>
              <input 
                value={profile.location}
                onChange={e => setProfile({...profile, location: e.target.value})}
                type="text" 
                className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder={t('address_placeholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('public_website')}</label>
              <input 
                value={profile.website}
                onChange={e => setProfile({...profile, website: e.target.value})}
                type="url" 
                className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="https://..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('business_description')}</label>
              <textarea 
                value={profile.description}
                onChange={e => setProfile({...profile, description: e.target.value})}
                rows="4" 
                className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder={t('description_placeholder')}
              ></textarea>
            </div>
            
            <div className="md:col-span-2 pt-6 border-t border-gray-100">
              <button 
                type="submit"
                className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> {t('save_details')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
