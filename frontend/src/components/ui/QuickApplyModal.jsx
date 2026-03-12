import { useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function QuickApplyModal({ job, onClose }) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    skills: '',
    experience: user?.occupation || ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const qualLevels = {
    'Not Needed': 0,
    'Below 10th': 1,
    '10th Pass': 2,
    '12th Pass': 3,
    'Graduate': 4
  };

  const isEligible = () => {
    if (!user || user.role !== 'SEEKER') return true;
    const userQual = qualLevels[user.qualification] || 0;
    const jobQual = qualLevels[job.minQualification] || 0;
    return userQual >= jobQual;
  };

  const eligible = isEligible();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // First ensure the user exists in the backend (mocking seeker registration)
      const userRes = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formData.phone,
          name: formData.name,
          role: 'SEEKER'
        })
      });
      const seeker = await userRes.json();

      const res = await fetch('http://localhost:5000/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job.id,
          seekerId: seeker.id,
          skills: formData.skills,
          experience: formData.experience
        })
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => onClose(), 2000);
      } else {
        const err = await res.json();
        alert(err.error || t('failed_apply'));
      }
    } catch (err) {
      console.error(err);
      alert(t('wrong_msg'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="relative p-6 border-b border-gray-100">
          <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold text-gray-900">{t('quick_apply_title')}</h2>
          <p className="text-sm text-gray-500">{t('applied_for')} <span className="text-blue-600 font-semibold">{job.title}</span></p>
          
          <div className={`mt-4 p-3 rounded-xl border flex items-center gap-3 ${eligible ? 'bg-green-50 border-green-100 text-green-700' : 'bg-orange-50 border-orange-100 text-orange-700'}`}>
            <div className={`w-2 h-2 rounded-full ${eligible ? 'bg-green-500' : 'bg-orange-500'}`}></div>
            <p className="text-xs font-bold uppercase tracking-wider">
              {eligible ? t('eligible_msg') : `${t('requirement_label')}: ${t(job.minQualification?.toLowerCase().replace(/ /g, '_')) || job.minQualification} (${t('you_label')}: ${t(user?.qualification?.toLowerCase().replace(/ /g, '_')) || user?.qualification || t('not_specified')})`}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 mb-2">
            <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase">{t('qualification')}</p>
              <p className="text-xs font-bold text-gray-700">{t(job.minQualification?.toLowerCase().replace(/ /g, '_')) || job.minQualification || t('not_needed')}</p>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase">{t('experience')}</p>
              <p className="text-xs font-bold text-gray-700">{t(job.minExperience?.toLowerCase().replace(/ /g, '_')) || job.minExperience || t('not_needed')}</p>
            </div>
          </div>

          {job.requiredDocs && (
            <div className="mt-3 bg-yellow-50 border border-yellow-100 p-3 rounded-xl">
              <p className="text-[10px] font-bold text-yellow-800 uppercase tracking-wider mb-1">{t('required_docs_label')}</p>
              <p className="text-xs text-yellow-700">{job.requiredDocs}</p>
            </div>
          )}
        </div>

        {success ? (
          <div className="p-12 text-center animate-in slide-in-from-bottom-4 duration-500">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('app_sent_title')}</h3>
            <p className="text-gray-500">{t('app_sent_msg')}</p>
          </div>
        ) : (
          <form className="p-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t('full_name_label')}</label>
              <input 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                type="text" 
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" 
                placeholder={t('name_placeholder')}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t('phone_number')}</label>
              <input 
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                type="tel" 
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" 
                placeholder="+91..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t('skills_label')}</label>
              <input 
                required
                value={formData.skills}
                onChange={(e) => setFormData({...formData, skills: e.target.value})}
                type="text" 
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" 
                placeholder={t('skills_placeholder')}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t('exp_optional_label')}</label>
              <textarea 
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" 
                rows="2" 
                placeholder={t('exp_placeholder')}
              ></textarea>
            </div>
            
            <button 
              disabled={loading}
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? t('sending') : t('submit_app')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
