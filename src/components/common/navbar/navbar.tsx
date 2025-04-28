import { type FunctionComponent } from 'preact';
import { type INavbarProps } from './interface';
import { Link } from 'wouter';
import { ModalServices } from '@/pages/home/modal/modal.services';
import { useSignal } from '@preact/signals';
import { PAGES_LIST_ROUTER } from '@/utils/routing';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export const Navbar: FunctionComponent<INavbarProps> = ({
  id,
  menus,
  logo,
  onActionHandler,
}: INavbarProps) => {
  const isOpen = useSignal(false);
  const { t } = useTranslation();

  const toggleMenu = () => {
    isOpen.value = !isOpen.value;
  };

  return (
    <nav
      id={id}
      className='flex font-bold px-2 sm:px-4 md:px-5 py-3 md:py-4 flex-row w-full content-center items-center absolute top-0 z-50'
    >
      <div className='flex w-2/5 md:w-1/5'>
        <span className='text-xl'>{logo}</span>
      </div>

      <div className='flex justify-end md:hidden w-full'>
        <button
          onClick={toggleMenu}
          className='flex flex-col justify-center items-center p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200'
        >
          <span
            className={`bg-gray-800 h-0.5 w-7 rounded-full transition-transform duration-300 ease-in-out ${isOpen.value ? 'rotate-45 translate-y-2.5' : ''}`}
          />
          <span
            className={`bg-gray-800 h-0.5 w-7 rounded-full transition-all duration-300 ease-in-out my-1.5 ${isOpen.value ? 'opacity-0' : ''}`}
          />
          <span
            className={`bg-gray-800 h-0.5 w-7 rounded-full transition-transform duration-300 ease-in-out ${isOpen.value ? '-rotate-45 -translate-y-2.5' : ''}`}
          />
        </button>
      </div>

      <div className='flex w-auto md:w-full justify-between items-center'>
        <ul
          className={`md:flex md:flex-row md:relative md:w-full md:justify-center absolute top-full left-0 w-full items-center text-center space-y-4 md:space-y-0 md:space-x-4 shadow-lg md:shadow-none transition-all duration-300 ${
            isOpen.value ? 'flex flex-col py-4 bg-ternary' : 'hidden'
          }`}
        >
          {/*{service && <li>{service}</li>}*/}
          {menus.map((menu) => (
            <li
              key={`navbar-menu-${menu.id}`}
              className='relative md:flex-shrink-0'
            >
              {menu.button && onActionHandler ? (
                <button
                  onClick={() => onActionHandler(menu.to)}
                  className='px-3 py-2 rounded hover:bg-opacity-20 transition-colors duration-200 whitespace-nowrap'
                >
                  {t(menu.label)}
                </button>
              ) : menu.label === 'Services' ? (
                <ModalServices label={menu.label} />
              ) : (
                <Link
                  to={menu.to}
                  className='px-3 py-2 rounded hover:bg-opacity-20 transition-colors duration-200 whitespace-nowrap'
                >
                  {t(menu.label)}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div className='ml-2 flex justify-end items-center gap-1 sm:gap-2 md:gap-3'>
          <div className='hidden sm:block'>
            <LanguageSwitcher />
          </div>
          <div className='w-8 h-8 sm:w-9 sm:h-9 md:w-11 md:h-11 bg-white rounded-full flex items-center justify-center'>
            <span className='vox-icon vx-icon-007 size-sm md:size-md !text-ternary flex items-center justify-center' />
          </div>
          <Link
            to={PAGES_LIST_ROUTER.dashboard.base}
            className='px-2 sm:px-3 md:px-4 lg:px-6 py-1 sm:py-1.5 md:py-2 rounded-full bg-white text-ternary hover:bg-opacity-90 transition-colors duration-200 whitespace-nowrap text-xs sm:text-sm md:text-base flex items-center justify-center min-w-[60px] sm:min-w-[70px] md:min-w-[80px]'
          >
            {t('navbar.signin')}
          </Link>
        </div>
      </div>
    </nav>
  );
};
