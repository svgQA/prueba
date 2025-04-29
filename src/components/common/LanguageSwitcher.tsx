import { useTranslation } from 'react-i18next';
import { CustomSwitcher } from './CustomSwitcher';

interface LanguageSwitcherProps {
  borderless?: boolean;
}

export const LanguageSwitcher = ({
  borderless = false,
}: LanguageSwitcherProps) => {
  const { i18n } = useTranslation();

  const languageOptions = [
    { id: 'es', label: 'Español', icon: '🇪🇸' },
    { id: 'en', label: 'English', icon: '🇬🇧' },
  ];

  const currentLanguage = i18n.language.startsWith('es') ? 'es' : 'en';

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <CustomSwitcher
      options={languageOptions}
      value={currentLanguage}
      onChange={handleLanguageChange}
      icon='🌐'
      borderless={borderless}
    />
  );
};
