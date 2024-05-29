import { type FunctionComponent } from 'preact';
import { type ICarouselProps } from './interface';
import { useEffect, useRef, useState } from 'preact/hooks';

export const Carousel: FunctionComponent<ICarouselProps> = ({
  id,
  name,
  children,
  visibleCount = 3,
}: ICarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const totalCount = children?.length || 0;
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      if (
        prevIndex + direction >= totalCount - visibleCount ||
        prevIndex + direction <= 0
      ) {
        setDirection(-direction);
      }
      return prevIndex + direction;
    });
  };

  useEffect(() => {
    if (totalCount <= visibleCount) return;
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, [totalCount, direction]);

  return (
    <div
      id={id}
      name={name}
      className='relative overflow-hidden w-36 h-96 m-1'
      ref={carouselRef}
    >
      <div
        className='flex flex-col transition-transform duration-500 ease h-full'
        style={{
          transform: `translateY(-${currentIndex * (100 / visibleCount)}%)`,
        }}
      >
        {children?.map((child, index) => (
          <div
            key={index}
            className='flex-shrink-0 flex-grow-0 w-full box-border'
            style={{ height: `${100 / visibleCount}%` }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};
