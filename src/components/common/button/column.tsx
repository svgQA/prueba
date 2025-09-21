import { type FunctionComponent } from 'preact';
import { useTranslation } from 'react-i18next';
import { ROW_ACTIONS } from '../table/enum';

interface IColumnButtonProps {
  id: number | string;
  type: 'shift' | 'response' | 'form';
  action: ROW_ACTIONS;
  icon?: string;
  label?: string;
  plain?: boolean;
  color?: string;
}

export const ButtonAction: FunctionComponent<IColumnButtonProps> = ({
  id,
  type,
  action,
  icon = '151',
  color = 'primary',
  label,
}: IColumnButtonProps) => {
  const { t } = useTranslation();
  return (
    <span
      className={
        label
          ? `hover:opacity-50 border text-primary border-b-light-dark dark:border-b-dark-light rounded px-2 py-1 text-sm cursor-pointer mr-3`
          : `hover:opacity-50 vox-icon  ${color} vx-icon-${icon} p-1 size-sm cursor-pointer`
      }
      data-id={id}
      data-type={type}
      data-action={action}
    >
      {label ? t(label) : ''}
    </span>
  );
};
