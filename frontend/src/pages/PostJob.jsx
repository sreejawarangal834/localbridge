import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { useTranslation } from 'react-i18next';

// Fix for default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

export default function PostJob() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const categories = [
    { id: "Retail", label: t('retail') },
    { id: "Medical", label: t('medical') },
    { id: "Hospitals", label: t('hospitals') },
    { id: "Delivery", label: t('delivery') },
    { id: "Call Center", label: t('call_center') },
    { id: "Warehouse", label: t('warehouse') },
    { id: "Shopping Mall", label: t('shopping_mall') },
    { id: "Hospitality", label: t('hospitality') },
    { id: "Manufacturing", label: t('manufacturing') },
    { id: "Other", label: t('other') }
  ];
  const [formData, setFormData] = useState({
    title: '',
    category: categories[0].id,
    customCategory: '',
    salary: '',
    salaryMin: '',
    salaryMax: '',
    location: '',
    workingHours: '',
    description: '',
    whatsapp: user?.phone || '',
    requiredDocs: '',
    minQualification: 'Not Needed',
    minExperience: 'Not Needed',
    lat: 17.9689,
    lng: 79.5941
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          category: formData.category === 'Other' ? formData.customCategory : formData.category,
          employerId: user.id
        })
      });
      if (res.ok) {
        alert(t('job_posted_success'));
        navigate('/employer');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('post_job_title')}</h1>
        <p className="text-gray-500 mb-8">{t('post_job_subtitle')}</p>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('job_title')}</label>
            <input 
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              type="text" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" 
              placeholder={t('title_placeholder')} 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('category')}</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>

            {formData.category === 'Other' && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('specify_category')}</label>
                <input 
                  name="customCategory"
                  required
                  value={formData.customCategory}
                  onChange={handleChange}
                  type="text" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" 
                  placeholder={t('custom_cat_placeholder')} 
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('monthly_salary')}</label>
              <input 
                name="salary"
                required
                value={formData.salary}
                onChange={handleChange}
                type="text" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" 
                placeholder={t('salary_placeholder')} 
              />
              <p className="text-xs text-gray-400 mt-1">{t('salary_hint')}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('min_qualification')}</label>
              <select 
                name="minQualification"
                value={formData.minQualification}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
              >
                <option value="Not Needed">{t('not_needed')}</option>
                <option value="Below 10th">{t('below_10th')}</option>
                <option value="10th Pass">{t('10th_pass')}</option>
                <option value="12th Pass">{t('12th_pass')}</option>
                <option value="Graduate">{t('graduate')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('min_experience')}</label>
              <select 
                name="minExperience"
                value={formData.minExperience}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
              >
                <option value="Not Needed">{t('not_needed')}</option>
                <option value="Fresher">{t('fresher')}</option>
                <option value="6 Months+">{t('six_months_plus')}</option>
                <option value="1 Year+">{t('one_year_plus')}</option>
                <option value="2 Years+">{t('two_years_plus')}</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('work_location')}</label>
            <input 
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition mb-4" 
              placeholder={t('location_placeholder')}
            />
            
            <div className="h-64 rounded-xl overflow-hidden border border-gray-200 shadow-inner relative group">
              <MapContainer center={[formData.lat, formData.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker 
                  position={{ lat: formData.lat, lng: formData.lng }} 
                  setPosition={(latlng) => setFormData({...formData, lat: latlng.lat, lng: latlng.lng})} 
                />
              </MapContainer>
              
              <div className="absolute top-4 left-4 right-4 z-[1000] flex gap-2">
                <input 
                  type="text"
                  placeholder={t('map_search_placeholder')}
                  className="flex-1 px-3 py-1.5 rounded-lg border-2 border-white shadow-lg outline-none focus:border-blue-500 text-sm"
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      try {
                        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(e.target.value)}`);
                        const data = await res.json();
                        if (data && data.length > 0) {
                          setFormData({
                            ...formData,
                            lat: parseFloat(data[0].lat),
                            lng: parseFloat(data[0].lon)
                          });
                        }
                      } catch (err) { console.error(err); }
                    }
                  }}
                />
                <button 
                  type="button"
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition((pos) => {
                        setFormData({
                          ...formData,
                          lat: pos.coords.latitude,
                          lng: pos.coords.longitude
                        });
                      }, () => alert(t('geo_fail')));
                    }
                  }}
                  className="bg-white border-2 border-blue-600 text-blue-600 font-bold px-3 py-1.5 rounded-lg shadow-lg hover:bg-blue-50 transition active:scale-95 text-xs flex items-center gap-2 whitespace-nowrap"
                >
                  <MapPin className="w-3 h-3" /> {t('detect_location')}
                </button>
              </div>

              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[1000] bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                {t('map_help')}
              </div>
            </div>
            <p className="text-[10px] text-gray-400 mt-2">{t('location_hint')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('working_hours')}</label>
              <input 
                name="workingHours"
                required
                value={formData.workingHours}
                onChange={handleChange}
                type="text" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" 
                placeholder={t('hours_placeholder')} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('required_docs')}</label>
              <textarea 
                name="requiredDocs"
                value={formData.requiredDocs}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" 
                placeholder={t('docs_placeholder')}
                rows="2"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('whatsapp_number')}</label>
              <input 
                name="whatsapp"
                required
                value={formData.whatsapp}
                onChange={handleChange}
                type="tel" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" 
                placeholder="+91..." 
              />
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100">
            <button 
              disabled={loading}
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? t('publishing') : t('publish_button')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
