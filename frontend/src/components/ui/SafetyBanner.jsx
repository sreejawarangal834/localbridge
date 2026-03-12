import { Shield, TriangleAlert as AlertTriangle, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SafetyBanner() {
  const { t } = useTranslation();
  const tips = [
    { text: t('tip_1'), icon: AlertTriangle, color: "text-red-600" },
    { text: t('tip_2'), icon: Shield, color: "text-blue-600" },
    { text: t('tip_3'), icon: CheckCircle, color: "text-green-600" }
  ];

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="w-5 h-5 text-amber-600" />
        <h3 className="font-bold text-amber-900 text-sm">{t('safety_tips_title')}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tips.map((tip, idx) => (
          <div key={idx} className="flex gap-3 items-start">
            <tip.icon className={`w-4 h-4 mt-0.5 shrink-0 ${tip.color}`} />
            <p className="text-xs text-amber-800 leading-tight">{tip.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
