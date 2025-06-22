import { type FunctionComponent } from 'preact';
import { type ICardSettingMenuProps } from './interface';
import { Link } from 'wouter';
import { memo } from 'preact/compat';
import { IMenu } from '@/components/common/utils/interface';
import { Card } from '@/components/common/card/card';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
    const g_label = `g_${label}`;

    return (
      <Card id={id} name={name} borderless rounded={false} transparent>
        <div className='flex flex-col mt-2'>
          <div className='flex flex-row items-center justify-between'>
            <h2 className='text-sm font-bold mb-1'>{t(g_label)}</h2>
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

            const m_label = `m_${menu.label}`;
            return menu.show ? (
              <Link
                to={to}
                key={name}
                data-to={to}
                data-label={menu.label}
                data-description={menu.description}
                id={menu.id}
                className={`${selected.to === to ? 'bg-primary bg-opacity-30 !text-primary' : ''} flex flex-row px-2 py-1 text-sm items-center my-0.5 rounded-md`}
              >
                <span className={`vx-icon vx-icon-${menu.icon} size-sm mr-2`} />
                {m_label}
              </Link>
            ) : null;
          })}
        </div>
      </Card>
    );
  },
  (prevProps, nextProps) => prevProps.selected.to === nextProps.selected.to
);
