import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Lock, Phone, Briefcase, Mail, ShieldCheck, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('SEEKER'); // SEEKER or EMPLOYER
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    shopName: '',
    email: '',
    businessType: 'Retail',
    qualification: 'Not Needed',
    occupation: '',
    roleInBusiness: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    if (location.pathname === '/signup' || location.state?.tab === 'signup') {
      setIsLogin(false);
    } else if (location.pathname === '/login' || location.state?.tab === 'login') {
      setIsLogin(true);
    }
  }, [location.pathname, location.state]);

  const validate = () => {
    let newErrors = {};
    if (!formData.phone.match(/^\d{10}$/)) newErrors.phone = t('phone_digits_error');
    if (!isLogin && formData.name.length < 3) newErrors.name = t('name_short_error');
    if (formData.password.length < 4) newErrors.password = t('password_short_error');
    if (!isLogin && !formData.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = t('email_invalid_error');
    if (!isLogin && role === 'EMPLOYER' && !formData.shopName) newErrors.shopName = t('shop_name_required_error');
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Simulate backend call
    const userData = {
      id: "user-" + Math.random().toString(36).substr(2, 9),
      name: formData.name || "User",
      phone: formData.phone,
      role: role,
      qualification: formData.qualification,
      occupation: formData.occupation,
      roleInBusiness: role === 'EMPLOYER' ? formData.roleInBusiness : undefined,
      address: formData.address
    };

    login(userData);
    alert(isLogin ? t('logged_in_msg') : t('registered_msg'));
    navigate(role === 'EMPLOYER' ? '/employer' : '/search');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 max-w-md w-full">
        <div className="flex justify-center mb-8">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-500/30 text-white">
            <ShieldCheck className="w-8 h-8" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
          {isLogin ? t('login_title') : t('register_title')}
        </h2>
        <p className="text-gray-500 text-center mb-8 text-sm">
          {isLogin ? t('login_subtitle') : t('register_subtitle')}
        </p>

        <div className="flex bg-gray-100 p-1 rounded-2xl mb-8">
          <button 
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 font-bold transition-all rounded-xl ${isLogin ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
          >
            {t('login')}
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 font-bold transition-all rounded-xl ${!isLogin ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
          >
            {t('signup')}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="flex gap-4 mb-4">
              <button 
                type="button"
                onClick={() => setRole('SEEKER')}
                className={`flex-1 py-3 border-2 rounded-xl text-xs font-bold transition ${role === 'SEEKER' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 text-gray-400'}`}
              >
                <User className="w-4 h-4 mx-auto mb-1" />
                {t('job_seeker')}
              </button>
              <button 
                type="button"
                onClick={() => setRole('EMPLOYER')}
                className={`flex-1 py-3 border-2 rounded-xl text-xs font-bold transition ${role === 'EMPLOYER' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 text-gray-400'}`}
              >
                <Briefcase className="w-4 h-4 mx-auto mb-1" />
                {t('employer')}
              </button>
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1">{t('full_name')}</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-300" />
                <input 
                  required
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition ${errors.name ? 'border-red-500' : 'border-gray-100 focus:border-blue-500'}`}
                  placeholder={t('name_placeholder')}
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              {errors.name && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.name}</p>}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1">{t('phone_number')}</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-300" />
              <input 
                required
                type="tel"
                className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition ${errors.phone ? 'border-red-500' : 'border-gray-100 focus:border-blue-500'}`}
                placeholder={t('phone_placeholder')}
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                maxLength={10}
              />
            </div>
            {errors.phone && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.phone}</p>}
          </div>

          {!isLogin && (
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1">{t('email_label')}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-300" />
                <input 
                  required
                  type="email"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition ${errors.email ? 'border-red-500' : 'border-gray-100 focus:border-blue-500'}`}
                  placeholder={t('email_placeholder')}
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              {errors.email && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.email}</p>}
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-300" />
                <input 
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-100 rounded-xl outline-none focus:border-blue-500 transition"
                  placeholder="Street, City, Area"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                />
              </div>
            </div>
          )}

          {!isLogin && role === 'SEEKER' && (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1">{t('qualification')}</label>
                <select 
                  className="w-full px-4 py-3 border border-gray-100 rounded-xl outline-none focus:border-blue-500 transition bg-white"
                  value={formData.qualification}
                  onChange={e => setFormData({...formData, qualification: e.target.value})}
                >
                  <option value="Not Needed">{t('not_needed')}</option>
                  <option value="Below 10th">{t('below_10th')}</option>
                  <option value="10th Pass">{t('10th_pass')}</option>
                  <option value="12th Pass">{t('12th_pass')}</option>
                  <option value="Graduate">{t('graduate')}</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1">{t('current_occupation')}</label>
                <input 
                  className="w-full px-4 py-3 border border-gray-100 rounded-xl outline-none focus:border-blue-500 transition"
                  placeholder={t('occupation_placeholder')}
                  value={formData.occupation}
                  onChange={e => setFormData({...formData, occupation: e.target.value})}
                />
              </div>
            </div>
          )}

          {!isLogin && role === 'EMPLOYER' && (
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1">{t('shop_name')}</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 w-5 h-5 text-gray-300" />
                <input 
                  required
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition ${errors.shopName ? 'border-red-500' : 'border-gray-100 focus:border-blue-500'}`}
                  placeholder="e.g. Raju Kirana Store"
                  value={formData.shopName}
                  onChange={e => setFormData({...formData, shopName: e.target.value})}
                />
              </div>
              {errors.shopName && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.shopName}</p>}
            </div>
          )}

          {!isLogin && role === 'EMPLOYER' && (
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1">Role in Business</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-300" />
                <input 
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-100 rounded-xl outline-none focus:border-blue-500 transition"
                  placeholder="e.g. Owner, Manager"
                  value={formData.roleInBusiness}
                  onChange={e => setFormData({...formData, roleInBusiness: e.target.value})}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1">{t('password')}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-300" />
              <input 
                required
                type="password"
                className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition ${errors.password ? 'border-red-500' : 'border-gray-100 focus:border-blue-500'}`}
                placeholder={t('password_placeholder')}
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
            {errors.password && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.password}</p>}
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 transition-all active:scale-95"
          >
            {isLogin ? t('login_now') : t('register_now')}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8">
          {isLogin ? t('no_account') : t('already_account')}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 font-bold ml-1 hover:underline"
          >
            {isLogin ? t('signup') : t('login')}
          </button>
        </p>
      </div>
    </div>
  );
}
