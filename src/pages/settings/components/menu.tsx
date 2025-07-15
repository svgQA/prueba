// import { IMenu } from '@/components/common/utils/interface';
import { CardSettingMenu, IModalSidebarMenu } from '@/components/compose/modal';
import { validateSettingModuleState } from '@/store/signals/access/permission';
import { memo } from 'preact/compat';
import { useNavigation } from '@/utils/hooks/navigation';

interface Props {
  menuSettings: IModalSidebarMenu[];
  expand: boolean;
}

export const MenuList = memo(({ menuSettings, expand }: Props) => {
  const { current } = useNavigation();
  return (
    <div
      className={`vox-scroll-design ${expand ? 'max-h-[98vh]' : 'max-h-[69vh]'} overflow-y-scroll px-4 flex flex-col gap-2 py-4`}
    >
      {menuSettings.map((menu: IModalSidebarMenu) => {
        return menu.show && validateSettingModuleState(menu.id) ? (
          <CardSettingMenu
            key={menu.id}
            id={menu.id}
            base={menu.base}
            label={menu.label}
            menus={menu.menus}
            setting={menu.setting}
            selected={current}
          />
        ) : null;
      })}
    </div>
  );
});
