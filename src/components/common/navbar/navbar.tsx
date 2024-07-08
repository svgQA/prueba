import { type FunctionComponent } from 'preact';
import { type INavbarProps } from './interface';
import { Link } from 'wouter';

export const Navbar: FunctionComponent<INavbarProps> = ({
  id,
  name,
  menus,
  logo,
  // actions,
}: INavbarProps) => {
  return (
    <nav
      id={id}
      name={name}
      className='flex font-bold px-5 py-8 flex-row justify-between w-full h-10 content-center items-center absolute text-white'
    >
      <span>{logo}</span>
      {/* <span className='px-5 content-center'>{actions}</span> */}
      <ul class='flex flex-row items-center text-center'>
        {menus.map((menu) => (
          <li key={`navbar-menu-${menu.to}`} className='px-2'>
            <Link to={menu.to}>{menu.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
