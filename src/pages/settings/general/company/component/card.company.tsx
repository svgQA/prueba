import { Button } from '@/components/common/button/button';
import { TextEllipsis } from '@/components/common/text-ellipsis';
import { ICompanyResponse } from '@/utils/types/company.interface';

export interface Props {
  company: ICompanyResponse;
  onEdit?: () => void;
  selected?: boolean;
}

export const CardCompany = ({ company, onEdit, selected }: Props) => {
  return (
    <div
      className={`p-6 w-11/12 dark:bg-b-dark-light bg-b-light rounded-lg border dark:border-b-dark-light border-b-b-light-dark ${selected ? 'border-2 border-ternary dark:border-ternary' : ''}`}
    >
      {/* Header */}
      <div className='flex items-start justify-between mb-4'>
        <div className='flex-1'>
          <h3 className='text-lg font-semibold truncate text-t-light dark:text-t-dark'>
            <TextEllipsis text={company.name} maxWidth='250px' />
          </h3>
          <p className='text-sm dark:text-gray-200 text-gray-800 mt-1'>
            Created: {new Date(company.createdAt).toLocaleDateString()}
          </p>
        </div>
        {/* Actions */}
        <div className='flex space-x-2 ml-4'>
          <Button
            name='company-setting-update'
            icon='123'
            onClick={onEdit}
            borderless
            transparent
          />
          {/*
            <Button name='company-setting-delete' icon='099' />
            */}
        </div>
      </div>

      {/* Description */}
      <span className='text-sm dark:text-gray-200 text-gray-800 mb-4 line-clamp-2'>
        <TextEllipsis text={company.description} maxWidth='250px' />
      </span>

      {/* Contact Info */}
      <div className='space-y-2'>
        {company.address && (
          <div className='flex items-start'>
            <span className='vox-icon vx-icon-168 size-sm dark:text-gray-200 text-gray-800 mr-2' />
            <span className='text-sm dark:text-gray-200 text-gray-800'>
              <TextEllipsis text={company.address} maxWidth='250px' />
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className='mt-4 pt-4 border-t border-gray-100'>
        <div className='flex items-center justify-between text-xs dark:text-gray-200 text-gray-800'>
          <span className='font-bold text-sm'>ID: {company.id}</span>
          <span>
            Last updated: {new Date(company.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};
