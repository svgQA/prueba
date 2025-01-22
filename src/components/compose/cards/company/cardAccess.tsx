import { Card } from '@/components/common/card/card';
import { memo } from 'react';

type CardProps = {
  title: string;
  subtitle: string;
  imageUrl: string;
  icon?: string;
  onEdit: () => void;
};

export const CardAccess = memo(
  ({ title, subtitle, imageUrl, icon, onEdit }: CardProps) => (
    <Card name='relative flex gap-4 p-4 max-w-md hover:bg-gray-50/50 transition-colors'>
      <div className='w-128 h-40  rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center'>
        {imageUrl ? (
          <img src={''} alt={title} className='w-100 h-full object-cover' />
        ) : (
          <div className='w-full h-full bg-gray-100' />
        )}
      </div>
      <div className='flex-1 min-w-0 pr-8'>
        <h3 className='font-semibold text-lg text-gray-900 mb-4 mt-4'>
          {title}
        </h3>
        <p className='text-sm text-gray-600 line-clamp-2 mb-4'>{subtitle}</p>
      </div>
      <button
        onClick={onEdit}
        className='bottom-4 right-4 p-2 rounded-full shadow-sm hover:bg-gray-300 transition-colors border-none ml-64'
        aria-label='Edit'
      >
        <span className={`vox-icon vx-icon-${icon} text-xs`}></span>
      </button>
    </Card>
  )
);
