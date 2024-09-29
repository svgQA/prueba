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
                {item.subItems && item.id !== 'planes-y-precios' && (
                  <span className='text-gray-400 group-hover:text-gray-700'>
                    &#62;
                  </span>
                )}
              </a>
              {item.subItems && item.id !== 'planes-y-precios' && (
                <div className='absolute left-full top-0 ml-2 invisible group-hover:visible bg-white bg-opacity-90 rounded-lg shadow-lg w-48'>
                  <ul className='py-2'>
                    {item.subItems.map((subItem) => (
                      <li key={subItem.id}>
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
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
