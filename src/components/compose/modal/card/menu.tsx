import { type FunctionComponent } from 'preact';
import { type ICardSettingMenuProps } from './interface';
import { Link } from 'wouter';
import { memo } from 'preact/compat';
import { IMenu } from '@/components/common/utils/interface';
import { Card } from '@/components/common/card/card';

export const CardSettingMenu: FunctionComponent<ICardSettingMenuProps> = memo(
  ({
    id,
    name,
    menus,
    label,
    base,
    selected,
    settings,
  }: ICardSettingMenuProps) => {
    const _to = `${base}${settings}`;
    return (
      <Card id={id} name={name} borderless rounded={false} transparent>
        <div className='flex flex-col mt-2'>
          <div className='flex flex-row items-center justify-between'>
            <h2 className='capitalize text-sm font-bold mb-1'>{label}</h2>
            {settings && (
              <Link to={_to} key={name} id={_to}>
                <span
                  className='vox-icon vx-icon-168 size-sm cursor-pointer'
                  data-to={_to}
                  data-label={label}
                  data-description='Settings'
                  id={id}
                />
              </Link>
            )}
          </div>
          {menus.map((menu: IMenu, index: number) => {
            const name = `setting-menu-${menu.id}-${index}`;
            const to = `${base}${menu.base}${menu.to}`;
            return menu.show ? (
              <Link
                to={to}
                key={name}
                data-to={to}
                data-label={menu.label}
                data-description={menu.description}
                id={menu.id}
                className={`${selected.to === to ? 'bg-primary bg-opacity-30 !text-primary' : ''} capitalize flex flex-row px-2 py-1 text-sm items-center my-0.5 rounded-md`}
              >
                <span className={`vx-icon vx-icon-${menu.icon} size-sm mr-2`} />
                {menu.label}
              </Link>
            ) : null;
          })}
        </div>
      </Card>
    );
  },
  (prevProps, nextProps) => prevProps.selected.to === nextProps.selected.to
);
