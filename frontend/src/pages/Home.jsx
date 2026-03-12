import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from '../components/layout/LanguageSwitcher';

export default function Home() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center relative">
      <div className="mb-8 p-4 bg-blue-50 rounded-full">
        <Briefcase className="w-12 h-12 text-blue-600" />
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
        {t('welcome')}
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mb-10">
        {t('subtitle')}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        {user ? (
          <Link 
            to="/search" 
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95"
          >
            <Search className="w-5 h-5" />
            {t('find_job')}
          </Link>
        ) : (
          <Link 
            to="/auth" 
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95"
          >
            {t('get_started_now')}
          </Link>
        )}
        <Link 
          to="/post-job" 
          className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200 font-semibold py-3 px-6 rounded-xl transition-all active:scale-95"
        >
          <MapPin className="w-5 h-5" />
          {t('post_job')}
        </Link>
      </div>
    </div>
  );
}
