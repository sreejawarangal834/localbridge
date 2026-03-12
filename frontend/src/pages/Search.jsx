import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, Filter, Briefcase, Star, Phone, Mic, MicOff, MapPin, Eye, ShieldCheck, Flag, ShoppingBag, Truck, Building2, HeartPulse, Store, PhoneCall, Boxes, Factory } from 'lucide-react';
import QuickApplyModal from '../components/ui/QuickApplyModal';
import SafetyBanner from '../components/ui/SafetyBanner';
import useVoiceSearch from '../hooks/useVoiceSearch';
import { useTranslation } from 'react-i18next';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function Search() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState([17.9689, 79.5941]); // Default to Warangal
  const [zoom, setZoom] = useState(13);

  const { isListening, startListening } = useVoiceSearch();
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const categories = [
    { id: "All", label: t('all_categories'), icon: Briefcase },
    { id: "Retail", label: t('retail'), icon: ShoppingBag },
    { id: "Delivery", label: t('delivery'), icon: Truck },
    { id: "Hospitals", label: t('hospitals'), icon: Building2 },
    { id: "Medical", label: t('medical'), icon: HeartPulse },
    { id: "Shopping Mall", label: t('shopping_mall'), icon: Store },
    { id: "Call Center", label: t('call_center'), icon: PhoneCall },
    { id: "Warehouse", label: t('warehouse'), icon: Boxes },
    { id: "Manufacturing", label: t('manufacturing'), icon: Factory },
  ];

  useEffect(() => {
    fetchJobs();
  }, [activeCategory, searchQuery]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:5000/api/jobs?`;
      if (activeCategory && activeCategory !== "All") url += `category=${activeCategory}&`;
      if (searchQuery) url += `search=${searchQuery}`;
      
      const res = await fetch(url);
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const incrementViews = async (jobId) => {
    try {
      await fetch(`http://localhost:5000/api/jobs/${jobId}/view`, { method: 'POST' });
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };

  const handleApply = (job) => {
    const message = `Hello, I saw your post for "${job.title}" on LocalBridge. I am interested!`;
    const whatsappUrl = `https://wa.me/${job.employer.phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const onVoiceResult = (result) => {
    setSearchQuery(result);
    // Auto-search can be triggered here if desired
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('find_local_job')}</h1>
        
        <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-gray-200 shadow-sm w-full md:w-auto">
          <SearchIcon className="w-5 h-5 text-gray-400 ml-2" />
          <input 
            type="text" 
            placeholder={t('search_jobs_shops')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none text-sm py-1"
          />
          <button 
            onClick={() => startListening(onVoiceResult)}
            className={`p-1.5 rounded-lg transition ${isListening ? 'bg-red-50 text-red-600 animate-pulse' : 'text-gray-400 hover:text-blue-600'}`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          <button 
            onClick={fetchJobs}
            className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            {t('find_job_button')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-200px)]">
        {/* Filters and List */}
        <div className="lg:col-span-4 flex flex-col gap-6 overflow-hidden">
          {/* Categories */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4 text-blue-600" />
              <h2 className="font-bold text-gray-900">{t('categories')}</h2> {/* Localized category header */}
            </div>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setActiveCategory("All")} // Changed to setActiveCategory
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${activeCategory === "All" ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {t('all_categories')} {/* Localized "All" */}
              </button>
              {categories.filter(cat => cat.id !== "All").map(cat => ( // Filter out "All" as it's handled above
                <button 
                  key={cat.id} // Changed key to cat.id
                  onClick={() => setActiveCategory(cat.id)} // Changed to setActiveCategory(cat.id)
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${activeCategory === cat.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {cat.label} {/* Use cat.label for display */}
                </button>
              ))}
            </div>
          </div>

          {/* Job List */}
          <SafetyBanner />
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {loading ? (
              <div className="text-center py-10 text-gray-500">{t('loading_jobs')}</div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-300">
                <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 font-medium">{t('no_jobs_found')}</p>
              </div>
            ) : (
              jobs.map(job => (
                <div key={job.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 transition-all cursor-pointer group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition tracking-tight">{job.title}</h3>
                      <Link 
                        to={`/employer-profile/${job.employerId}`}
                        className="text-xs text-blue-600 font-bold hover:underline block mt-0.5"
                      >
                        {job.employer?.shopName || t('local_business')}
                      </Link>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" /> {job.location}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                        {job.salary}
                      </span>
                      {job.isFlagged && (
                        <span className="text-[10px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded font-bold border border-red-100 uppercase">{t('suspicious')}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 mb-4 text-xs font-medium text-gray-600">
                    <span className="bg-gray-100 px-2 py-1 rounded-md">{t(job.category?.toLowerCase()) || job.category}</span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {job.employer?.rating || t('no_reviews_yet')}
                    </span>
                    {job.employer?.isVerified && (
                      <span className="flex items-center gap-0.5 text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                        <ShieldCheck className="w-2.5 h-2.5 fill-blue-600" /> {t('verified')}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleApply(job)}
                      className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition"
                    >
                      <Phone className="w-3 h-3" /> WhatsApp
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedJob(job);
                        setShowApplyModal(true);
                        incrementViews(job.id);
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition shadow-md shadow-blue-500/20"
                    >
                      {t('quick_apply')}
                    </button>
                      <button 
                        title={t('report_job')}
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            await fetch('http://localhost:5000/api/trust/report', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                jobId: job.id,
                                reporterId: 'mock-seeker-id',
                                reason: 'Fake/Suspicious'
                              })
                            });
                            alert(t('job_reported'));
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                      >
                        <Flag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
  
          {/* Map */}
          <div className="lg:col-span-8 bg-gray-200 rounded-3xl overflow-hidden relative shadow-inner">
            <MapContainer center={mapCenter} zoom={zoom} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {jobs.filter(j => j.lat && j.lng).map(job => (
                <Marker key={job.id} position={[job.lat, job.lng]}>
                  <Popup>
                    <div className="p-1">
                      <h3 className="font-bold text-gray-900">{job.title}</h3>
                      <p className="text-xs text-gray-500 mb-2">{job.location}</p>
                      <p className="text-sm font-bold text-blue-600">{job.salary}</p>
                      <button 
                        onClick={() => handleApply(job)}
                        className="mt-2 w-full bg-green-600 text-white text-[10px] py-1 px-2 rounded font-bold"
                      >
                        {t('whatsapp_employer')}
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          
          {/* User Location Control Shortcut */}
          <button 
            className="absolute bottom-6 right-6 z-[1000] bg-white p-3 rounded-2xl shadow-xl hover:bg-gray-50 text-blue-600 transition active:scale-90"
            onClick={() => {
              navigator.geolocation.getCurrentPosition((pos) => {
                setMapCenter([pos.coords.latitude, pos.coords.longitude]);
                setZoom(15);
              });
            }}
          >
            <MapPin className="w-6 h-6" />
          </button>
        </div>
      </div>

      {showApplyModal && selectedJob && (
        <QuickApplyModal 
          job={selectedJob} 
          onClose={() => {
            setShowApplyModal(false);
            setSelectedJob(null);
          }} 
        />
      )}
    </div>
  );
}
