// components/TrustBadges.tsx
interface TrustBadgesProps {
    lang?: 'en' | 'fr' | 'ar' | 'es';
  }
  
  export default function TrustBadges({ lang = 'en' }: TrustBadgesProps) {
    const badges = [
      { icon: '⭐', label: { en: '4.9/5 Rating', fr: 'Note 4.9/5', ar: 'تقييم 4.9/5', es: 'Calificación 4.9/5' }[lang] },
      { icon: '🛡️', label: { en: 'Secure Booking', fr: 'Réservation Sécurisée', ar: 'حجز آمن', es: 'Reserva Segura' }[lang] },
      { icon: '🌍', label: { en: 'Local Experts', fr: 'Experts Locaux', ar: 'خبراء محليون', es: 'Expertos Locales' }[lang] },
      { icon: '💬', label: { en: '24/7 Support', fr: 'Support 24/7', ar: 'دعم على مدار الساعة', es: 'Soporte 24/7' }[lang] },
    ];
  
    return (
      <div className="bg-white border-y border-gray-100 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
            {badges.map((badge, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-600">
                <span className="text-lg">{badge.icon}</span>
                <span className="text-sm font-medium">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }