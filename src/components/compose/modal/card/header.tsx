import { type FunctionComponent } from 'preact';
import { type ICardSettingHeaderProps } from './interface';
import { useTranslation } from 'react-i18next';

export const CardSettingHeader: FunctionComponent<ICardSettingHeaderProps> = ({
  title,
  description,
}: ICardSettingHeaderProps) => {
  const { t } = useTranslation();
  const t_title = String(`t_${title}`.toLowerCase());
  return (
    <div className='px-2 py-3 border-b-2 border-b-gray-50 dark:border-b-dark-light'>
      <div className='flex flex-row items-center h-12'>
        {/* <span className='vox-icon vx-icon-091 size-xl' /> */}
        <div className='w-full pl-4'>
          <h3 className='text-xl font-bold text-pretty'>{t(t_title)}</h3>
          <p className='font-thin'>{description}</p>
        </div>
      </div>
    </div>
  );
};
