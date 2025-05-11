import { CardSettingMenu } from '@/components/compose/modal';
import { memo } from 'preact/compat';

export const MenuList = memo(
  ({ menuSettings, menuInformationSelected }: any) => (
    <div className='vox-scroll-design max-h-[68vh] overflow-y-scroll px-4 flex flex-col gap-2'>
      {menuSettings.value.map((menu: any) => {
        const name = `${menu.label}-menus`;
        return menu.show ? (
          <CardSettingMenu
            key={name}
            id={name}
            name={name}
            base={menu.base}
            label={menu.label}
            menus={menu.menus}
            settings={menu.settings}
            selected={menuInformationSelected}
          />
        ) : null;
      })}
    </div>
  )
);
