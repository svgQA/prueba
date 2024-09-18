import { FunctionComponent } from 'preact/compat';
import { MenuItem } from './menu.items';

interface VerticalMenuProps {
  items: MenuItem[];
}

export const VerticalMenu: FunctionComponent<VerticalMenuProps> = ({
  items,
}) => {
  return (
    <div className='w-64 h-full bg-gray-100 border-r border-gray-200 relative'>
      <nav className='py-4'>
        <ul className='space-y-2'>
          {items.map((item) => (
            <li key={item.id} className='relative group'>
              <a
                href={`#${item.id}`}
                className='block px-4 py-2 text-gray-700 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 transition-colors duration-200 flex justify-between items-center'
              >
                {item.label}
                {item.subItems && (
                  <span className='text-gray-400 group-hover:text-gray-700'>
                    &#62;
                  </span>
                )}
              </a>
              {item.subItems && (
                <div className='absolute left-full top-0 ml-2 invisible group-hover:visible bg-transparent backdrop-blur-sm w-[calc(80vw-16rem)] h-[72vh] overflow-auto z-30'>
                  <div className='p-4 bg-white bg-opacity-80 rounded-lg h-full'>
                    <h3 className='text-lg font-semibold mb-2 text-gray-800'>
                      {item.label}
                    </h3>
                    <ul className='space-y-2'>
                      {item.subItems.map((subItem) => (
                        <li key={subItem.id}>
                          <a
                            href={`#${subItem.id}`}
                            className='block px-2 py-1 text-sm text-gray-700 hover:bg-gray-200 hover:bg-opacity-50 rounded transition-colors duration-200'
                          >
                            {subItem.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

// import { FunctionComponent } from 'preact/compat';
// import { MenuItem } from './menu.items';

// interface VerticalMenuProps {
//   items: MenuItem[];
// }

// export const VerticalMenu: FunctionComponent<VerticalMenuProps> = ({ items }) => {
//   return (
//     <div className='w-64 h-full bg-gray-100 border-r border-gray-200 relative'>
//       <nav className='py-4'>
//         <ul className='space-y-2'>
//           {items.map((item) => (
//             <li key={item.id} className='relative group'>
//               <a
//                 href={`#${item.id}`}
//                 className='block px-4 py-2 text-gray-700 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 transition-colors duration-200 flex justify-between items-center'
//               >
//                 {item.label}
//                 {item.subItems && <span className='text-gray-400 group-hover:text-gray-700'>&#62;</span>}
//               </a>
//               {item.subItems && (
//                 <div className='absolute left-full top-0 ml-2 invisible group-hover:visible bg-white shadow-lg rounded-lg w-[calc(80vw-16rem)] h-[72vh] overflow-auto z-30'>
//                   <div className='p-4'>
//                     <h3 className='text-lg font-semibold mb-2'>{item.label}</h3>
//                     <ul className='space-y-2'>
//                       {item.subItems.map((subItem) => (
//                         <li key={subItem.id}>
//                           <a
//                             href={`#${subItem.id}`}
//                             className='block px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded'
//                           >
//                             {subItem.label}
//                           </a>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>
//               )}
//             </li>
//           ))}
//         </ul>
//       </nav>
//     </div>
//   );
// };
