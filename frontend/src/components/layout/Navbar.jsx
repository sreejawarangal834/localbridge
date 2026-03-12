import { Link } from 'react-router-dom';
import { Briefcase, Search, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">Local<span className="text-blue-600">Bridge</span></span>
            </Link>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>

            <Link to="/search" className="text-gray-600 hover:text-blue-600 flex flex-col items-center transition-colors">
              <Search className="w-5 h-5" />
              <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">{t('jobs')}</span>
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <Link to={user.role === 'EMPLOYER' ? '/employer' : '/search'} className="text-gray-600 hover:text-blue-600 flex flex-col items-center transition-colors">
                  <User className="w-5 h-5" />
                  <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">{t('profile')}</span>
                </Link>
                <button onClick={() => logout()} className="text-gray-600 hover:text-red-600 flex flex-col items-center transition-colors">
                  <LogOut className="w-5 h-5" />
                  <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">{t('logout')}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-blue-600 font-bold px-3 py-2 text-sm transition"
                >
                  {t('login')}
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 whitespace-nowrap"
                >
                  {t('signup')}
                </Link>
              </div>
            )}

            <Link 
              to="/post-job" 
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 bg-white text-blue-600 border-2 border-blue-600 text-sm font-bold rounded-xl hover:bg-blue-50 transition"
            >
              {t('post_job')}
            </Link>
          </div>
        </div>
      </div>
      {/* Mobile Language Switcher */}
      <div className="md:hidden px-4 py-2 border-t border-gray-50 flex justify-center">
        <LanguageSwitcher />
      </div>
    </nav>
  );
}
