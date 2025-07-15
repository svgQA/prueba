import { type FunctionComponent } from 'preact';
import { type ICardSettingHeaderProps } from './interface';
import { useTranslation } from 'react-i18next';
import {
  computedCreateMenu,
  computedValidateBlackList,
  computedValidateNewMenu,
  menuInformationSelected,
} from '@/utils/hooks/store/settings';
import { Link } from 'wouter';

export const CardSettingHeader: FunctionComponent<
  ICardSettingHeaderProps
> = () => {
  const { t } = useTranslation();
  return (
    <div className='px-2 flex flex-col w-1/2 py-2'>
      <div className='flex flex-col dark:bg-b-dark-light bg-b-light-light py-0.5 w-80 rounded-br-2xl px-3'>
        <h3 className='text-xl font-bold text-pretty'>
          {t(menuInformationSelected.value.label)}
        </h3>
        <p className='font-thin text-xs h-4'>
          {t(menuInformationSelected.value.description || '')}
        </p>
        {menuInformationSelected.value.id}
      </div>
      <div className='w-fit rounded-md flex items-center mt-2 h-8'>
        {computedValidateBlackList.value && computedValidateNewMenu.value && (
          <Link
            to={computedCreateMenu.value.link}
            data-to={computedCreateMenu.value.link}
            data-label='create'
            data-description='d_create'
            id={`${computedCreateMenu.value.id}:create`}
            className='bg-ternary w-full px-4 py-1 rounded-md'
          >
            <span className='vx-icon vx-icon-045 size-sm mr-2 h-full' />
            {t('new')}
          </Link>
        )}
      </div>
      {/*
      <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800'>
        {computedCreateMenu.value.id}
      </span>
      */}
    </div>
  );
};
