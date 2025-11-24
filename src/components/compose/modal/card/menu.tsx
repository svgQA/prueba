import { type FunctionComponent } from 'preact';
import { type ICardSettingMenuProps } from './interface';
import { Link } from 'wouter';
import { IMenu } from '@/components/common/utils/interface';
import { Card } from '@/components/common/card/card';
import { useTranslation } from 'react-i18next';
import { validateSettingModuleState } from '@/store/signals/access/permission';
import { useNavigation } from '@/utils/hooks/navigation';

export const CardSettingMenu: FunctionComponent<ICardSettingMenuProps> = ({
  id,
  menus,
  label,
  base,
  setting,
}: ICardSettingMenuProps) => {
  const _to = `${base}${setting?.to || ''}`;
  const { t } = useTranslation();
  const { current } = useNavigation();

  return (
    <Card id={id} name={id} borderless rounded={false} transparent>
      <div className='flex flex-col mt-1 sm:mt-2'>
        <div className='flex flex-row items-center justify-between min-h-[28px] sm:min-h-0'>
          <h2 className='text-sm font-bold mb-1 sm:mb-2'>{t(label)}</h2>
          {setting && setting.show && (
            // validateSettingModuleState(setting.id) &&
            <Link to={_to} id={setting.id}>
              <span
                data-to={_to}
                data-label={label}
                data-description='Settings'
                id={setting.id}
                className={`${current.id === setting.id ? 'bg-primary bg-opacity-30 text-primary' : ''} vox-icon vx-icon-168 size-sm cursor-pointer p-2 rounded transition-colors`}
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
              className={`${current.id === menu.id ? 'bg-primary bg-opacity-80 text-white' : ''} flex flex-row items-center justify-start md:justify-start px-2 py-1 text-sm my-0.5 rounded-md transition-colors`}
              title={t(menu.label)}
            >
              <span
                className={`vx-icon vx-icon-${menu.icon} size-sm mr-0 sm:mr-2 ${current.id === menu.id ? 'text-white' : ''}`}
                style={{ pointerEvents: 'none' }}
              />
              <span
                className='hidden sm:inline text-left'
                style={{ pointerEvents: 'none' }}
              >
                {t(menu.label)}
              </span>
            </Link>
          ) : null;
        })}
      </div>
    </Card>
  );
};
