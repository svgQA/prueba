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
          className='flex flex-col justify-center items-center p-1.5 rounded-lg hover:bg-gray-100 hover:bg-opacity-20 transition-colors duration-200 border !border-white'
        >
          <span
            className={`bg-white border-b w-7 rounded-full transition-transform duration-300 ease-in-out ${isOpen.value ? 'rotate-45 translate-y-2.5' : ''}`}
          />
          <span
            className={`bg-white border-b w-7 rounded-full transition-all duration-300 ease-in-out my-1.5 ${isOpen.value ? 'opacity-0' : ''}`}
          />
          <span
            className={`bg-white border-b w-7 rounded-full transition-transform duration-300 ease-in-out ${isOpen.value ? '-rotate-45 -translate-y-2.5' : ''}`}
          />
        </button>
      </div>

      <div className='flex w-auto md:w-full justify-between items-center'>
        <ul
          className={`md:flex md:flex-row md:relative md:w-auto md:mx-auto md:justify-center absolute top-full left-0 w-full items-center text-center space-y-4 md:space-y-0 md:space-x-4 shadow-lg md:shadow-none transition-all duration-300 rounded-full border-2 border-white py-2 px-5 bg-white dark:bg-b-dark-dark text-primary ${
            isOpen.value ? 'flex flex-col py-4 bg-ternary' : 'hidden md:flex'
          }`}
        >
          {menus.map((menu) => (
            <li
              key={`navbar-menu-${menu.id}`}
              className='relative md:flex-shrink-0'
            >
              {menu.button && onActionHandler ? (
                <button
                  onClick={() => {
                    onActionHandler(menu.to);
                    if (isOpen.value) toggleMenu();
                  }}
                  className='px-3 py-2 rounded hover:bg-opacity-20 transition-colors duration-200 whitespace-nowrap'
                >
                  {t(menu.label)}
                </button>
              ) : menu.label === 'Services' ? (
                <div onClick={() => isOpen.value && toggleMenu()}>
                  <ModalServices label={menu.label} />
                </div>
              ) : (
                <Link
                  to={menu.to}
                  onClick={() => isOpen.value && toggleMenu()}
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
          <Link
            to={PAGES_LIST_ROUTER.dashboard.base}
            className='px-2 sm:px-3 md:px-4 lg:px-6 py-[3px] rounded-lg bg-white text-ternary hover:bg-opacity-90 transition-colors duration-200 whitespace-nowrap text-xs sm:text-sm md:text-base flex items-center justify-center min-w-[60px] sm:min-w-[70px] md:min-w-[80px]'
          >
            <span className='vox-icon vx-icon-007 size-sm md:size-md !text-ternary flex items-center justify-center px-3' />
            {t('i_navbar_signin')}
          </Link>
        </div>
      </div>
    </nav>
  );
};
