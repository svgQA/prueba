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
    { value: 'es', label: 'Español', sIcon: '🇪🇸' },
    { value: 'en', label: 'English', sIcon: '🇬🇧' },
  ];

  const currentLanguage = i18n.language.startsWith('es') ? 'es' : 'en';

  const handleLanguageChange = (lng: string | number) => {
    i18n.changeLanguage(String(lng));
  };

  return (
    <CustomSwitcher
      options={languageOptions}
      value={currentLanguage}
      onChange={handleLanguageChange}
      icon='080'
      borderless={borderless}
    />
  );
};
