import { Card } from '@/components/common';
import { type FunctionComponent } from 'preact';
import { type ICardSettingMenuProps } from './interface';
import { type IMenu } from '@/components/common/interface';
import { Link } from 'wouter';
import { memo } from 'preact/compat';

export const CardSettingMenu: FunctionComponent<ICardSettingMenuProps> = memo(
  ({ id, name, menus, label, base, selected }: ICardSettingMenuProps) => {
    return (
      <Card id={id} name={name}>
        <div className=''>
          <h2 className='capitalize text-sm font-semibold mb-2'>{label}</h2>
          {menus.map((menu: IMenu, index: number) => {
            const name = `setting-menu-${menu.id}-${index}`;
            const to = `${base}${menu.base}${menu.to}`;
            return (
              <Link
                to={to}
                key={name}
                name={name}
                data-to={to}
                data-label={menu.label}
                data-description={menu.description}
                id={menu.id}
                className={`${selected.to === to ? 'bg-primary text-white' : ''} capitalize flex flex-row px-2 py-1 text-sm items-center my-0.5 rounded-md`}
              >
                <span
                  className={`vox-icon vx-icon-${menu.icon} size-sm mr-2`}
                />
                {menu.label}
              </Link>
            );
          })}
        </div>
      </Card>
    );
  },
  (prevProps, nextProps) => prevProps.selected.to === nextProps.selected.to
);
