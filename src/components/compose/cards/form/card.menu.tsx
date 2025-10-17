import { IMenu } from '@/components/common/utils/interface';
import './index.css';
import { type FunctionComponent } from 'preact';
import { useLocation } from 'wouter';
import { appendHistory } from '@/utils/hooks/store/settings';

export interface ICardMenuProps {
  menu: IMenu;
  title: string;
  description: string;
  icon: string;
  event?: () => void;
}

export const CardMenu: FunctionComponent<ICardMenuProps> = ({
  menu,
  title,
  description,
  icon,
  event,
}: ICardMenuProps) => {
  const [_, navigate] = useLocation();
  const handleOnClick = (e: MouseEvent) => {
    e.stopPropagation();
    navigate(menu.to);
    appendHistory(menu);
    event?.();
  };

  return (
    <div
      className='form-button-general cursor-pointer flex items-center p-4 border-2 border-gray-100 dark:border-b-dark-light'
      onClick={handleOnClick}
    >
      <div className='rounded-full bg-primary-opacity-2 flex w-12 text-center mr-4 justify-center'>
        <span className={`vx-icon vx-icon-${icon} size-xl text-primary`} />
      </div>
      <div className='flex flex-col'>
        <h4 className='mb-1'>{title}</h4>
        <p className='text-sm text-gray-600'>{description}</p>
      </div>
    </div>
  );
};
