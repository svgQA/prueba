import { IMenu } from '@/components/common/utils/interface';
import './index.css';
import { type FunctionComponent } from 'preact';
import { useLocation } from 'wouter';
import { appendHistory } from '@/pages/settings/store/settings';

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
    <div className='form-button-general cursor-pointer' onClick={handleOnClick}>
      <span className={`vx-icon vx-icon-${icon} size-xl text-primary`} />
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  );
};
