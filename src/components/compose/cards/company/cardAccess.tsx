import { Card } from '@/components/common/card/card';
import { memo } from 'react';
import edificioImagen from '../../../../assets/image/edificio.jpg';
import { Button } from '@/components/common/button/button';
import { Badge } from '@/components/common/badge/badge';
import { TextEllipsis } from '@/components/common/text-ellipsis';

type CardProps = {
  title: string;
  subtitle: string;
  imageUrl: string;
  icon?: string;
  onEdit: () => void;
  type: string;
  link: string;
};

export const CardAccess = memo(
  ({ title, subtitle, imageUrl, icon, onEdit, type, link }: CardProps) => (
    <Card>
      <div className='flex flex-row min-h-24'>
        <div className='min-h-full'>
          <img
            src={imageUrl || edificioImagen}
            alt={title}
            className='object-cover h-full w-full'
          />
        </div>
        <div className='flex flex-col justify-between min-h-full px-1'>
          <div className=''>
            <h3 className='font-semibold text-lg'>{title}</h3>
            <TextEllipsis text={subtitle} maxWidth='250px' />
            <TextEllipsis text={link} maxWidth='250px' />
          </div>
          <div className='flex flex-row justify-between items-center'>
            <Badge color='primary' label={type} outline />
            <Button
              icon={icon}
              onClick={onEdit}
              name='button-card'
              borderless
              iconSize='sm'
            />
          </div>
        </div>
      </div>
    </Card>
  )
);
