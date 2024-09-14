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
}: INavbarProps) => {
  return (
    <nav
      id={id}
      name={name}
      className='flex font-bold px-5 py-4 flex-row justify-between w-full content-center items-center absolute text-white top-0'
    >
      <span>{logo}</span>
      <ul className='flex flex-row items-center text-center'>
        {menus.map((menu) => (
          <li key={`navbar-menu-${menu.to}`} className='px-2 relative'>
            {menu.button && onActionHandler ? (
              <button onClick={() => onActionHandler(menu.to)}>
                {menu.label}
              </button>
            ) : menu.label === 'Services' ? (
              <ModalServices to={menu.to} label={menu.label} />
            ) : (
              <Link to={menu.to}>{menu.label}</Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

// import { type FunctionComponent } from 'preact';
// import { type INavbarProps } from './interface';
// import { Link } from 'wouter';

// export const Navbar: FunctionComponent<INavbarProps> = ({
//   id,
//   name,
//   menus,
//   logo,
//   onActionHandler,
// }: INavbarProps) => {
//   return (
//     <nav
//       id={id}
//       name={name}
//       className='flex font-bold px-5 py-4 flex-row justify-between w-full content-center items-center absolute text-white top-0'
//     >
//       <span>{logo}</span>
//       {/* <span className='px-5 content-center'>{actions}</span> */}
//       <ul class='flex flex-row items-center text-center'>
//         {menus.map((menu) => (
//           <li key={`navbar-menu-${menu.to}`} className='px-2'>
//             {menu.button && onActionHandler ? (
//               <button onClick={() => onActionHandler(menu.to)}>
//                 {menu.label}
//               </button>
//             ) : (
//               <Link to={menu.to}>{menu.label}</Link>
//             )}
//           </li>
//         ))}
//       </ul>
//     </nav>
//   );
// };
