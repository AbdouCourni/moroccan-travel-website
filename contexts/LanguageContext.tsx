// contexts/LanguageContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'fr' | 'ar' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

// Translation dictionary - ONLY HERE, remove from Header
export const translations: Record<Language, Record<string, string>> = {
  en: {
    'home': 'Home',
    'destinations': 'Destinations',
    'stays': 'Stays',
    'transport': 'Transport',
    'culture': 'Culture',
    'login': 'Login',
    'logout': 'Logout',
    'profile': 'Profile',
    'settings': 'Settings',
    'explore_morocco': 'Explore Morocco',
    'search': 'Search',
    'book_now': 'Book Now',
    'learn_more': 'Learn More',
    'welcome': 'Welcome',
     'noPlacesFound': 'No places found',
    'checkBackLater': 'Check back later for new places in this destination.',
    'noDescription': 'No description available',
    'bestTime': 'Best time',
    'viewDetails': 'View Details',
    'save': 'Save'
  },
  fr: {
    'home': 'Accueil',
    'destinations': 'Destinations',
    'stays': 'Hébergements',
    'transport': 'Transport',
    'culture': 'Culture',
    'login': 'Connexion',
    'logout': 'Déconnexion',
    'profile': 'Profil',
    'settings': 'Paramètres',
    'explore_morocco': 'Explorez le Maroc',
    'search': 'Rechercher',
    'book_now': 'Réserver',
    'learn_more': 'En savoir plus',
    'welcome': 'Bienvenue',
    'noPlacesFound': 'Aucun lieu trouvé',
    'checkBackLater': 'Revenez plus tard pour de nouveaux lieux dans cette destination.',
    'noDescription': 'Aucune description disponible',
    'bestTime': 'Meilleur moment',
    'viewDetails': 'Voir les détails',
    'save': 'Sauvegarder'
  },
  ar: {
    'home': 'الرئيسية',
    'destinations': 'الوجهات',
    'stays': 'الإقامات',
    'transport': 'النقل',
    'culture': 'الثقافة',
    'login': 'تسجيل الدخول',
    'logout': 'تسجيل الخروج',
    'profile': 'الملف الشخصي',
    'settings': 'الإعدادات',
    'explore_morocco': 'استكشف المغرب',
    'search': 'بحث',
    'book_now': 'احجز الآن',
    'learn_more': 'اعرف المزيد',
    'welcome': 'مرحبا',
    'noPlacesFound': 'لم يتم العثور على أماكن',
    'checkBackLater': 'ارجع لاحقًا للاطلاع على الأماكن الجديدة في هذه الوجهة.',
    'noDescription': 'لا يوجد وصف متاح',
    'bestTime': 'أفضل وقت',
    'viewDetails': 'عرض التفاصيل',
    'save': 'حفظ'
  },
  es: {
    'home': 'Inicio',
    'destinations': 'Destinos',
    'stays': 'Estancias',
    'transport': 'Transporte',
    'culture': 'Cultura',
    'login': 'Iniciar Sesión',
    'logout': 'Cerrar Sesión',
    'profile': 'Perfil',
    'settings': 'Configuración',
    'explore_morocco': 'Explora Marruecos',
    'search': 'Buscar',
    'book_now': 'Reservar Ahora',
    'learn_more': 'Saber Más',
    'welcome': 'Bienvenido',
     'noPlacesFound': 'No se encontraron lugares',
    'checkBackLater': 'Vuelve más tarde para ver nuevos lugares en este destino.',
    'noDescription': 'No hay descripción disponible',
    'bestTime': 'Mejor momento',
    'viewDetails': 'Ver detalles',
    'save': 'Guardar'
  }
};

interface LanguageProviderProps {
  children: React.ReactNode;
  initialLanguage: Language;
}

export function LanguageProvider({ children, initialLanguage }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  // Sync with localStorage and update document attributes
  useEffect(() => {
    const savedLanguage = localStorage.getItem('moroCompase-language') as Language | null;
    if (savedLanguage && ['en', 'fr', 'ar', 'es'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('moroCompase-language', language);
    
    // Update document attribute
    document.documentElement.lang = language;
    
    // Set cookie for server-side detection
    const maxAge = 60 * 60 * 24 * 365;
    const secureFlag = process.env.NODE_ENV === 'production' ? '; Secure' : '';
    document.cookie = `moroCompase-language=${language}; path=/; max-age=${maxAge}; SameSite=Lax${secureFlag}`;
  }, [language]);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}