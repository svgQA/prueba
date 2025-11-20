import { useState } from 'preact/hooks';
import { Logo } from '@/components/common/logo/logo';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { Link } from 'wouter';

const navItems = [
  { id: 'hero', label: 'Inicio', href: '#inicio' },
  { id: 'features', label: 'Soluciones', href: '#soluciones' },
  { id: 'pros', label: 'Beneficios', href: '#beneficios' },
  { id: 'about', label: 'Nosotros', href: '#nosotros' },
  { id: 'beta', label: 'Únete a la beta', href: '#beta' },
];

export const HomeHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className='fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/40 shadow-sm'>
      <div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8'>
        <div className='flex items-center gap-3'>
          <Logo slogan='Tryvoo' />
          <div className='flex flex-col leading-tight text-sm font-semibold text-[#0b1f33] uppercase tracking-wide'>
            <span>Tryvoo</span>
            <span className='text-[11px] text-[#0b1f33]/70'>Operaciones inteligentes</span>
          </div>
        </div>

        <nav className='hidden lg:flex items-center gap-8 text-sm font-semibold text-[#0b1f33]'>
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={closeMenu}
              className='hover:text-primary transition-colors duration-200'
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className='hidden md:flex items-center gap-3'>
          <LanguageSwitcher borderless />
          <Link
            to='/demo'
            className='rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200'
          >
            Agendar demo
          </Link>
          <a
            href='#beta'
            className='rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-white transition-colors duration-200'
          >
            Únete a la beta
          </a>
        </div>

        <button
          type='button'
          onClick={toggleMenu}
          className='flex h-11 w-11 items-center justify-center rounded-lg border border-[#d7e3f2] bg-white shadow-sm lg:hidden'
        >
          <span className='sr-only'>Abrir menú</span>
          <div className='space-y-1.5'>
            <span
              className={`block h-0.5 w-7 bg-[#0b1f33] transition-transform duration-300 ${
                isOpen ? 'translate-y-[7px] rotate-45' : ''
              }`}
            />
            <span className={`block h-0.5 w-7 bg-[#0b1f33] transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
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
                {item.label}
              </a>
            ))}
            <div className='flex items-center justify-between gap-3 pt-2'>
              <LanguageSwitcher />
              <Link
                to='/demo'
                className='rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md'
                onClick={closeMenu}
              >
                Demo
              </Link>
              <a
                href='#beta'
                onClick={closeMenu}
                className='rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-white'
              >
                Beta
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
