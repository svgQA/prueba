import { FunctionComponent } from 'preact/compat';
import { MenuItem } from './modal.menu.items';

interface VerticalMenuProps {
  items: MenuItem[];
  onItemChange: (item: MenuItem | null) => void;
}

export const VerticalMenu: FunctionComponent<VerticalMenuProps> = ({
  items,
  onItemChange,
}) => {
  return (
    <div className='w-64 h-full bg-gray-100 border-r border-gray-200 relative'>
      <nav className='py-4'>
        <ul className='space-y-2'>
          {items.map((item) => (
            <li
              key={item.id}
              className='relative group'
              onMouseEnter={() => onItemChange(item)}
            >
              <a
                href={`#${item.id}`}
                className='block px-4 py-2 text-gray-700 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 transition-colors duration-200 flex justify-between items-center'
              >
                {item.label}
                <span
                  className={`
                    ${item.subItems && item.id !== 'planes-y-precios' ? 'visible' : 'invisible'}
                    text-gray-400 group-hover:text-gray-700 transition-colors duration-200
                  `}
                >
                  &#62;
                </span>
              </a>
              <div
                className={`
                  ${item.subItems && item.id !== 'planes-y-precios' ? 'group-hover:visible group-hover:opacity-100' : 'invisible opacity-0'}
                  absolute left-full top-0 ml-2 bg-white bg-opacity-90 rounded-lg shadow-lg w-48 transition-opacity duration-200
                `}
              >
                <ul className='py-2'>
                  {items.map((subItem) => (
                    <li
                      key={subItem.id}
                      className={`
                        ${item.subItems && item.subItems.some((sub) => sub.id === subItem.id) ? 'block' : 'hidden'}
                      `}
                    >
                      <a
                        href={`#${subItem.id}`}
                        className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                      >
                        {subItem.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
