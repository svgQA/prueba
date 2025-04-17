import { useState, useRef, useEffect } from 'preact/hooks';
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Obtener el idioma actual
  const currentLanguage = i18n.language.startsWith('es')
    ? 'Español'
    : 'English';

  // Cambiar idioma
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  // Cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center px-4 py-2 text-sm font-medium text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-70'
      >
        <span className='mr-1'>🌐</span> {currentLanguage}{' '}
        <span className='ml-1'>▼</span>
      </button>

      {isOpen && (
        <div className='absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10'>
          <div className='py-1'>
            <button
              onClick={() => changeLanguage('es')}
              className={`block w-full text-left px-4 py-2 text-sm ${
                currentLanguage === 'Español'
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              Español
            </button>
            <button
              onClick={() => changeLanguage('en')}
              className={`block w-full text-left px-4 py-2 text-sm ${
                currentLanguage === 'English'
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              English
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
