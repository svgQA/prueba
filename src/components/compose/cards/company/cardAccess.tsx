import { Card } from '@/components/common/card/card';
import { memo, useState } from 'preact/compat';
import { Button } from '@/components/common/button/button';
import { Badge } from '@/components/common/badge/badge';
import { TextEllipsis } from '@/components/common/text-ellipsis';

type CardProps = {
  title: string;
  subtitle: string;
  imageUrl: string;
  icon?: string;
  onEdit: () => void;
  onDelete: () => void;
  type: string;
  link: string;
  groups: {
    group: {
      id: number;
      name: string;
    };
  }[];
  id: number;
  updatedAt: Date;
  selected: boolean;
};

// TODO: Subir a s3
const DEFAULT_IMAGE =
  'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png';

export const CardAccess = memo(
  ({
    title,
    subtitle,
    imageUrl,
    icon,
    onEdit,
    onDelete,
    type,
    link,
    groups,
    updatedAt,
    id,
    selected,
  }: CardProps) => {
    const [imageError, setImageError] = useState(false);
    const [currentImageSrc, setCurrentImageSrc] = useState(
      imageUrl || DEFAULT_IMAGE
    );

    const handleImageError = () => {
      if (!imageError) {
        setImageError(true);
        setCurrentImageSrc(DEFAULT_IMAGE);
      }
    };

    const handleImageLoad = () => {
      setImageError(false);
    };

    return (
      <Card name={`card-access-${id}`}>
        <div
          className={`flex flex-col ${selected ? 'border-2 border-ternary' : ''}`}
        >
          <div className='flex flex-row min-h-24'>
            <div className='flex flex-col justify-between min-h-full px-4 py-3 flex-1'>
              <div className=''>
                <h3 className='font-semibold text-lg'>{title}</h3>
                <TextEllipsis
                  text={subtitle}
                  maxWidth='250px'
                  className='text-t-light dark:text-t-dark'
                />
                <TextEllipsis
                  text={'enlace: ' + link}
                  maxWidth='250px'
                  className='text-t-light dark:text-t-dark'
                />
                <TextEllipsis
                  text={'icon: ' + icon}
                  maxWidth='250px'
                  className='text-t-light dark:text-t-dark'
                />
                <TextEllipsis
                  text={'grupos: ' + groups.map((group) => group.group.name)}
                  maxWidth='250px'
                  className='text-t-light dark:text-t-dark'
                />
              </div>
              <div className='flex flex-row justify-between items-center'>
                <Badge color='primary' label={type} outline />
                <Button
                  icon={'123'}
                  onClick={onEdit}
                  name='button-card'
                  borderless
                  iconSize='sm'
                  className='border border-white text-white hover:bg-white hover:text-gray-800'
                />
                <Button
                  icon={'053'}
                  textColor='red'
                  selectedColor='bg-red-500'
                  onClick={onDelete}
                  name='button-card-delete'
                  borderless
                  iconSize='sm'
                  className='border border-white text-white hover:bg-white hover:text-gray-800'
                />
              </div>
            </div>
            <div className='min-h-full w-1/3'>
              <img
                src={currentImageSrc}
                alt={title}
                className='object-cover h-full w-full rounded-r'
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
            </div>
          </div>
          {/* Footer */}
          <div className='px-4 py-3 border-t border-gray-100 dark:border-gray-700'>
            <div className='flex items-center justify-between text-xs dark:text-gray-400 text-gray-600'>
              <span>ID: {id}</span>
              <span>
                Actualizado: {new Date(updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </Card>
    );
  }
);
