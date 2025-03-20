import { type FunctionComponent } from 'preact';
import { type ICardSettingMenuProps } from './interface';
import { Link } from 'wouter';
import { memo } from 'preact/compat';
import { IMenu } from '@/components/common/utils/interface';
import { Card } from '@/components/common/card/card';

export const CardSettingMenu: FunctionComponent<ICardSettingMenuProps> = memo(
  ({ id, name, menus, label, base, selected }: ICardSettingMenuProps) => {
    return (
      <Card id={id} name={name} color='p-0 m-0 border-r-2' rounded={false}>
          <div className='flex flex-col mt-3'>
          <h2 className='text-xs font-bold text-black mb-2 px-8'>{label}</h2>
          <div className='flex flex-col gap-1'>
            {menus.map((menu: IMenu, index: number) => {
              const name = `setting-menu-${menu.id}-${index}`;
              const to = `${base}${menu.base}${menu.to}`;
              
              return (
                <Link
                  to={to}
                  key={name}
                  data-to={to}
                  data-label={menu.label}
                  data-description={menu.description}
                  id={menu.id}
                  className={`flex items-center px-8 py-2 rounded-md text-sm font-medium transition-all duration-200 w-full text-gray-600 hover:bg-gray-100`}
                >
                  <span className={`vox-icon vx-icon-${menu.icon} size-sm mr-2 text-gray-500`} />
                  {menu.label}
                </Link>
              );
            })}
          </div>
        </div>
      </Card>
    );
  },
  (prevProps, nextProps) => prevProps.selected.to === nextProps.selected.to
);
