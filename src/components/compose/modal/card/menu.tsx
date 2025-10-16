import { type FunctionComponent } from 'preact';
import { type ICardSettingMenuProps } from './interface';
import { Link } from 'wouter';
import { memo } from 'preact/compat';
import { IMenu } from '@/components/common/utils/interface';
import { Card } from '@/components/common/card/card';
import { useTranslation } from 'react-i18next';
import { validateSettingModuleState } from '@/store/signals/access/permission';

export const CardSettingMenu: FunctionComponent<ICardSettingMenuProps> = memo(
  ({ id, menus, label, base, selected, setting }: ICardSettingMenuProps) => {
    const _to = `${base}${setting?.to || ''}`;
    const { t } = useTranslation();

    return (
      <Card id={id} name={id} borderless rounded={false} transparent>
        <div className='flex flex-col mt-2'>
          <div className='flex flex-row items-center justify-between'>
            <h2 className='text-sm font-bold mb-1'>{t(label)}</h2>
            {setting &&
              setting.show &&
              validateSettingModuleState(setting.id) && (
                <Link to={_to} id={setting.id}>
                  <span
                    data-to={_to}
                    data-label={label}
                    data-description='Settings'
                    id={setting.id}
                    className={`${selected.id === setting.id ? 'bg-primary bg-opacity-30 !text-primary' : ''} vox-icon vx-icon-168 size-sm cursor-pointer p-2 rounded`}
                  />
                </Link>
              )}
          </div>
          {menus.map((menu: IMenu) => {
            const to = `${base}${menu.base}${menu.to}`;
            return menu.show && validateSettingModuleState(menu.id) ? (
              <Link
                to={to}
                key={menu.id}
                data-to={to}
                data-label={menu.label}
                data-description={menu.description}
                id={menu.id}
                className={`${selected.id === menu.id ? 'bg-primary bg-opacity-30 !text-primary' : ''} flex flex-row px-2 py-1 text-sm items-center my-0.5 rounded-md`}
              >
                <span className={`vx-icon vx-icon-${menu.icon} size-sm mr-2`} />
                {t(menu.label)}
              </Link>
            ) : null;
          })}
        </div>
      </Card>
    );
  },
  (prevProps, nextProps) => prevProps.selected.id === nextProps.selected.id
);
