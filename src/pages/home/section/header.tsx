import { useState } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import { Logo } from '@/components/common/logo/logo';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { app_environment } from '@/env.config';
import { Link } from 'wouter';

const navItems = [
  { id: 'hero', labelKey: 'h_nav_home', href: '#inicio' },
  { id: 'features', labelKey: 'h_nav_solutions', href: '#soluciones' },
  { id: 'pros', labelKey: 'h_nav_benefits', href: '#beneficios' },
  { id: 'about', labelKey: 'h_nav_about', href: '#nosotros' },
];

export const HomeHeader = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className='fixed inset-x-0 top-0 z-50 border-b border-white/40 bg-white/75 shadow-sm backdrop-blur-md'>
      <div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8'>
        <div className='flex items-center gap-3'>
          <Logo slogan={t('h_logo_slogan')} color='text-ternary' gradient />
        </div>

        <nav className='hidden lg:flex items-center gap-8 text-sm font-semibold text-[#0b1f33]'>
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={closeMenu}
              className='hover:text-primary transition-colors duration-200 text-ternary'
            >
              {t(item.labelKey)}
            </a>
          ))}
        </nav>

        <div className='hidden md:flex items-center gap-3'>
          <LanguageSwitcher borderless />
          {/*
          <Link
            to='/demo'
            className='rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200'
          >
            Agendar demo
          </Link>
          */}
          {app_environment === 'dev' && (
            <Link
              to='/signin'
              className='rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200'
            >
              Signin
            </Link>
          )}
          <a
            href='#beta'
            className='rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-white transition-colors duration-200'
          >
            {t('h_cta_beta')}
          </a>
        </div>

        <button
          type='button'
          onClick={toggleMenu}
          className='flex h-11 w-11 items-center justify-center rounded-lg border border-[#d7e3f2] bg-white shadow-sm lg:hidden'
        >
          <span className='sr-only'>{t('h_menu_open')}</span>
          <div className='space-y-1.5'>
            <span
              className={`block h-0.5 w-7 bg-[#0b1f33] transition-transform duration-300 ${
                isOpen ? 'translate-y-[7px] rotate-45' : ''
              }`}
            />
            <span
              className={`block h-0.5 w-7 bg-[#0b1f33] transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}
            />
            <span
              className={`block h-0.5 w-7 bg-[#0b1f33] transition-transform duration-300 ${
                isOpen ? '-translate-y-[7px] -rotate-45' : ''
              }`}
            />
          </div>
        </button>
      </div>

      {isOpen && (
        <div className='lg:hidden border-t border-[#d7e3f2] bg-white shadow-xl'>
          <div className='mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6'>
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={closeMenu}
                className='text-base font-semibold text-[#0b1f33] hover:text-primary'
              >
                {t(item.labelKey)}
              </a>
            ))}
            <div className='flex items-center justify-between gap-3 pt-2'>
              <LanguageSwitcher />
              {/*
              <Link
                to='/demo'
                className='rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md'
                onClick={closeMenu}
              >
                Demo
              </Link>
              */}
              <a
                href='#beta'
                onClick={closeMenu}
                className='rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-white'
              >
                {t('h_cta_beta_short')}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
