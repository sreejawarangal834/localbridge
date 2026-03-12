import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
      <button 
        onClick={() => i18n.changeLanguage('en')}
        className={`px-3 py-1 rounded text-xs font-bold transition ${i18n.language === 'en' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
      >
        English
      </button>
      <button 
        onClick={() => i18n.changeLanguage('te')}
        className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${i18n.language === 'te' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
      >
        తెలుగు
      </button>
      <button 
        onClick={() => i18n.changeLanguage('hi')}
        className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${i18n.language === 'hi' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
      >
        हिंदी
      </button>
    </div>
  );
}
