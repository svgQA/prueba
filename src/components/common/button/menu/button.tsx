import { type FunctionComponent } from 'preact';
import { type IButtonMenuProps } from './interface';
import { useTranslation } from 'react-i18next';

export const ButtonMenu: FunctionComponent<IButtonMenuProps> = ({
  label,
  icon,
  small,
}: IButtonMenuProps) => {
  const { t } = useTranslation();
  return (
    <div
      className={`flex relative flex-col items-center justify-center ${small ? 'h-10' : 'h-14'}`}
    >
      <span className={`left-0 vx-icon vx-icon-${icon}`}></span>
      <h6
        className={`
          ${small ? 'text-2xs' : 'text-[8.8px]'}
          capitalize truncate font-bold overflow-hidden whitespace-nowrap max-w-9
        `}
        title={label}
      >
        {t(label)}
      </h6>
      <span className='absolute w-full h-full'></span>
    </div>
  );
};
