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
    onEdit,
    onDelete,
    type,
    link,
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
      <div
        className={`w-7/12 max-w-[520px] dark:bg-b-dark-light bg-b-light rounded-lg border dark:border-b-dark-light border-b-b-light-dark ${selected ? 'border-2 border-ternary dark:border-ternary' : ''}`}
      >
        <div className='flex flex-row min-h-24'>
          <div className='flex flex-col justify-between min-h-full p-3 flex-1'>
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
              {/*
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
              */}
            </div>
            <div className='flex flex-row justify-between items-center'>
              <Badge color='primary' label={type} outline />
              <div className='flex flex-row gap-2'>
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
            <div className='py-1 border-t border-gray-100 dark:border-gray-700'>
              <div className='flex items-center justify-between text-xs dark:text-gray-400 text-gray-600'>
                <span className='font-bold text-sm'>ID: {id}</span>
                <span>
                  Actualizado: {new Date(updatedAt).toLocaleDateString()}
                </span>
              </div>
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
      </div>
    );
  }
);
