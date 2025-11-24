import { CardSettingMenu, IModalSidebarMenu } from '@/components/compose/modal';
// import { validateSettingModuleState } from '@/store/signals/access/permission';
import { memo } from 'preact/compat';

interface Props {
  menuSettings: IModalSidebarMenu[];
  expand: boolean;
  mobileColumns?: boolean;
}

export const MenuList = memo(
  ({ menuSettings, expand, mobileColumns = false }: Props) => {
    return (
      <div
        className={`vox-scroll-design ${expand ? 'max-h-[98vh]' : 'max-h-[69vh]'} overflow-y-scroll px-2 sm:px-4 ${
          mobileColumns
            ? 'grid grid-cols-2 gap-2 sm:grid-cols-3'
            : 'flex flex-col gap-2'
        } py-3 sm:py-4`}
      >
        {menuSettings.map((menu: IModalSidebarMenu) => {
          return menu.show /* && validateSettingModuleState(menu.id) */ ? (
            <CardSettingMenu
              key={menu.id}
              id={menu.id}
              base={menu.base}
              label={menu.label}
              menus={menu.menus}
              setting={menu.setting}
            />
          ) : null;
        })}
      </div>
    );
  }
);
