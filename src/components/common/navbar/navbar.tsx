import { type FunctionComponent } from 'preact';
import { type INavbarProps } from './interface';
import { Link } from 'wouter';
import { ModalServices } from '@/pages/home/modal/modal.services';

export const Navbar: FunctionComponent<INavbarProps> = ({
  id,
  name,
  menus,
  logo,
  onActionHandler,
  service,
}: INavbarProps) => {
  return (
    <nav
      id={id}
      name={name}
      className='flex font-bold px-5 py-4 flex-row justify-between w-full content-center items-center absolute top-0 z-50'
    >
      <span className='text-xl'>{logo}</span>
      <ul className='flex flex-row items-center text-center space-x-4'>
        {service && <li>{service}</li>}
        {menus.map((menu) => (
          <li key={`navbar-menu-${menu.id}`} className='relative'>
            {menu.button && onActionHandler ? (
              <button
                onClick={() => onActionHandler(menu.to)}
                className='px-3 py-2 rounded hover:bg-opacity-20 transition-colors duration-200'
              >
                {menu.label}
              </button>
            ) : menu.label === 'Services' ? (
              <ModalServices label={menu.label} />
            ) : (
              <Link
                to={menu.to}
                className='px-3 py-2 rounded hover:bg-opacity-20 transition-colors duration-200'
              >
                {menu.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};
