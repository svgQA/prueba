// modal.vertical.menu.tsx
import { FunctionComponent } from 'preact/compat';
import { MenuItem } from './modal.menu.items';
import { PriceCard } from './modal.price.card';
import { plans } from './modal.price.data'; // Importamos los planes dinámicos

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
              onMouseLeave={() => onItemChange(null)}
            >
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
                <div className='absolute left-full top-0 ml-2 invisible group-hover:visible bg-transparent backdrop-blur-sm w-[calc(90vw-16rem)] h-[72vh] overflow-auto z-30'>
                  <div className='p-6 bg-white bg-opacity-90 rounded-lg h-full'>
                    {item.id === 'planes-y-precios' && (
                      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {plans.map((plan) => (
                          <PriceCard key={plan.id} plan={plan} />
                        ))}
                      </div>
                    )}
                    {item.id !== 'planes-y-precios' &&
                      item.id !== 'clientes' &&
                      item.id !== 'aliados' &&
                      item.subItems && (
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
                      )}
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
