import { FunctionComponent } from 'preact';

const BrandCarousel: FunctionComponent = () => {
  const brands = [
    {
      id: 1,
      name: 'Google Cloud',
      svg: (
        <svg
          width='48'
          height='48'
          viewBox='0 0 48 48'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z'
            fill='currentColor'
          />
        </svg>
      ),
    },
    {
      id: 2,
      name: 'AWS',
      svg: (
        <svg
          width='48'
          height='48'
          viewBox='0 0 48 48'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20s20-8.954 20-20S35.046 4 24 4zm0 36c-8.837 0-16-7.163-16-16S15.163 8 24 8s16 7.163 16 16s-7.163 16-16 16z'
            fill='currentColor'
          />
          <path
            d='M32 24c0 4.418-3.582 8-8 8s-8-3.582-8-8s3.582-8 8-8s8 3.582 8 8z'
            fill='currentColor'
          />
        </svg>
      ),
    },
    {
      id: 3,
      name: 'PostgreSQL',
      svg: (
        <svg
          width='48'
          height='48'
          viewBox='0 0 48 48'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M32.5 24.5c0-4.5 3.5-6.5 3.5-6.5-2-2.5-5-3-6-3-2.5-0.5-5-1.5-7-1.5-2 0-4 1-5.5 1-1.5 0-3-1-5-1-2 0-4.5 1-7 1.5-1 0-4 0.5-6 3 0 0 3.5 2 3.5 6.5 0 4.5-3.5 6.5-3.5 6.5 2 2.5 5 3 6 3 2.5 0.5 5 1.5 7 1.5 2 0 4-1 5.5-1 1.5 0 3 1 5 1 2 0 4.5-0.5 7-1.5 1 0 4-0.5 6-3 0 0-3.5-2-3.5-6.5z'
            fill='currentColor'
          />
          <path
            d='M36 16c0-2-1-4-2.5-5.5-1.5-1.5-3.5-2.5-5.5-2.5-2 0-4 1-5.5 1-1.5 0-3.5-1-5.5-1-2 0-4 1-5.5 2.5C8 12 7 14 7 16c0 2 1 4 2.5 5.5 1.5 1.5 3.5 2.5 5.5 2.5 2 0 4-1 5.5-1 1.5 0 3.5 1 5.5 1 2 0 4-1 5.5-2.5C35 20 36 18 36 16z'
            fill='currentColor'
          />
        </svg>
      ),
    },
    {
      id: 4,
      name: 'Docker',
      svg: (
        <svg
          width='48'
          height='48'
          viewBox='0 0 48 48'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20s20-8.954 20-20S35.046 4 24 4zm0 36c-8.837 0-16-7.163-16-16S15.163 8 24 8s16 7.163 16 16s-7.163 16-16 16z'
            fill='currentColor'
          />
          <path
            d='M32 24c0 4.418-3.582 8-8 8s-8-3.582-8-8s3.582-8 8-8s8 3.582 8 8z'
            fill='currentColor'
          />
        </svg>
      ),
    },
    {
      id: 5,
      name: 'Microsoft Azure',
      svg: (
        <svg
          width='48'
          height='48'
          viewBox='0 0 48 48'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path d='M22.5 22.5H11.25V11.25H22.5V22.5Z' fill='currentColor' />
          <path d='M36.75 22.5H25.5V11.25H36.75V22.5Z' fill='currentColor' />
          <path d='M22.5 36.75H11.25V25.5H22.5V36.75Z' fill='currentColor' />
          <path d='M36.75 36.75H25.5V25.5H36.75V36.75Z' fill='currentColor' />
        </svg>
      ),
    },
    {
      id: 6,
      name: 'MongoDB',
      svg: (
        <svg
          width='48'
          height='48'
          viewBox='0 0 48 48'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20s20-8.954 20-20S35.046 4 24 4zm0 36c-8.837 0-16-7.163-16-16S15.163 8 24 8s16 7.163 16 16s-7.163 16-16 16z'
            fill='currentColor'
          />
          <path
            d='M24 12c-6.627 0-12 5.373-12 12s5.373 12 12 12s12-5.373 12-12s-5.373-12-12-12zm0 20c-4.418 0-8-3.582-8-8s3.582-8 8-8s8 3.582 8 8s-3.582 8-8 8z'
            fill='currentColor'
          />
        </svg>
      ),
    },
  ];

  return (
    <div className='relative w-full overflow-hidden bg-transparent py-12'>
      <div className='absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-cyan-500 to-transparent pointer-events-none' />
      <div className='absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-emerald-400 to-transparent pointer-events-none' />

      <div className='flex gap-20 items-center min-w-max animate-scroll'>
        {[...brands, ...brands, ...brands].map((brand, index) => (
          <div
            key={`${brand.id}-${index}`}
            className='flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity duration-300 px-4'
          >
            {brand.svg}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandCarousel;
