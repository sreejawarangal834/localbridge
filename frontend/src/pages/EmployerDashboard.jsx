import { useState, useEffect } from 'react';
import { Briefcase, Users, Eye, Plus, MapPin, Phone, CheckCircle, ShieldCheck as ShieldCircle, Award, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function EmployerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verificationLevel, setVerificationLevel] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStep, setVerifyStep] = useState(1); // 1: Phone, 2: Business, 3: Documents
  const [otp, setOtp] = useState('');
  const [businessData, setBusinessData] = useState({
    shopName: '',
    businessType: 'Retail',
    address: '',
    gstNumber: ''
  });

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch user profile to get verification level
      const userRes = await fetch(`http://localhost:5000/api/users`);
      const allUsers = await userRes.json();
      const currentUser = allUsers.find(u => u.id === user.id);
      if (currentUser) {
        setVerificationLevel(currentUser.verificationLevel || 0);
      }

      const jobsRes = await fetch('http://localhost:5000/api/jobs');
      const allJobs = await jobsRes.json();
      setJobs(allJobs.filter(j => j.employerId === user.id));

      const appsRes = await fetch(`http://localhost:5000/api/applications/employer/${user.id}`);
      const appsData = await appsRes.json();
      setApplications(appsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhone = async (e) => {
    e.preventDefault();
    if (otp === '1234') { // Mock OTP
      try {
        await fetch(`http://localhost:5000/api/users/verify-phone`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id })
        });
        alert(t('phone_verified'));
        setVerificationLevel(1);
        setVerifyStep(2);
      } catch (err) {
        console.error(err);
      }
    } else {
      alert(t('invalid_otp'));
    }
  };

  const handleVerifyBusiness = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/profiles/${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(businessData)
      });
      if (res.ok) {
        alert(t('business_submitted'));
        setVerificationLevel(2);
        setVerifyStep(3);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Verification Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 mb-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
            {verificationLevel >= 3 ? <Award className="w-10 h-10" /> : <ShieldCircle className="w-10 h-10" />}
          </div>
          <div>
            <h2 className="text-xl font-bold">{t('verification_level')}: {verificationLevel}/3</h2>
            <p className="text-blue-100 text-sm">
              {verificationLevel === 0 && t('verify_hint_0')}
              {verificationLevel === 1 && t('verify_hint_1')}
              {verificationLevel === 2 && t('verify_hint_2')}
              {verificationLevel === 3 && t('verify_hint_3')}
            </p>
          </div>
        </div>
        
        {verificationLevel < 3 && (
          <button 
            onClick={() => setIsVerifying(true)}
            className="bg-white text-blue-600 font-bold py-3 px-8 rounded-2xl hover:bg-blue-50 transition shadow-lg shrink-0"
          >
            {t('upgrade_level')}
          </button>
        )}
      </div>

      {isVerifying && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            {verifyStep === 1 && (
              <div>
                <p className="text-gray-500 mb-6">{t('level_1_otp')}</p>
                <div className="bg-blue-50 p-4 rounded-xl mb-6 text-sm text-blue-800">
                  {t('otp_sent_msg')}
                </div>
                <form onSubmit={handleVerifyPhone} className="space-y-4">
                  <input 
                    required
                    maxLength={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 text-center text-2xl font-bold tracking-widest uppercase"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    placeholder="0000"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <button type="button" onClick={() => { setIsVerifying(false); setOtp(''); }} className="py-3 text-gray-500 font-bold">{t('cancel')}</button>
                    <button type="submit" className="py-3 bg-blue-600 text-white rounded-xl font-bold">{t('verify_otp')}</button>
                  </div>
                </form>
              </div>
            )}

            {verifyStep === 2 && (
              <div>
                <p className="text-gray-500 mb-6">{t('level_2_business')}</p>
                <form onSubmit={handleVerifyBusiness} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">{t('shop_business_name')}</label>
                    <input 
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                      value={businessData.shopName}
                      onChange={e => setBusinessData({...businessData, shopName: e.target.value})}
                      placeholder={t('shop_name_placeholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">{t('full_address')}</label>
                    <input 
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                      value={businessData.address}
                      onChange={e => setBusinessData({...businessData, address: e.target.value})}
                      placeholder={t('address_placeholder')}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <button type="button" onClick={() => setIsVerifying(false)} className="py-3 text-gray-500 font-bold">{t('cancel')}</button>
                    <button type="submit" className="py-3 bg-blue-600 text-white rounded-xl font-bold">{t('next_step')}</button>
                  </div>
                </form>
              </div>
            )}

            {verifyStep === 3 && (
              <div>
                <p className="text-gray-500 mb-6">{t('level_3_docs')}</p>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                      <Plus className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm font-bold text-gray-900">{t('shop_license_label')}</p>
                    <p className="text-xs text-gray-400 mt-1">{t('accepted_files_hint')}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button type="button" onClick={() => setIsVerifying(false)} className="py-3 text-gray-500 font-bold">{t('cancel')}</button>
                    <button 
                      onClick={() => {
                        alert(t('docs_uploaded_msg'));
                        setVerificationLevel(3);
                        setIsVerifying(false);
                      }} 
                      className="py-3 bg-blue-600 text-white rounded-xl font-bold"
                    >
                      {t('complete_verification')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('employer_dashboard')}</h1>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { logout(); navigate('/'); }}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 font-bold py-2 px-4 rounded-xl hover:bg-gray-50 transition"
          >
            {t('logout')}
          </button>
          <Link 
            to="/post-job" 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl shadow-lg shadow-blue-500/30 transition"
          >
            <Plus className="w-4 h-4" /> {t('post_new_job')}
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{t('active_jobs')}</p>
            <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{t('total_applicants')}</p>
            <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{t('total_job_views')}</p>
            <p className="text-2xl font-bold text-gray-900">{jobs.reduce((acc, job) => acc + (job.views || 0), 0)}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-lg text-gray-900 mb-4">{t('your_job_postings')}</h2>
          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('no_jobs_posted')}</h3>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map(job => (
                <div key={job.id} className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-gray-900">{job.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{job.location} • {job.salary}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-blue-600">{job.views || 0}</p>
                    <p className="text-[10px] text-gray-400 uppercase">{t('views_badge')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-lg text-gray-900 mb-4">{t('recent_applicants')}</h2>
          {applications.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('no_applicants')}</h3>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map(app => (
                <div key={app.id} className="p-4 border border-gray-100 rounded-xl flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-gray-900">{app.seeker.name}</h4>
                    <p className="text-xs text-gray-500">{t('applied_for')}: {app.job.title}</p>
                  </div>
                  <a href={`tel:${app.seeker.phone}`} className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition">
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
