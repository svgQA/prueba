import { IPresignedRequest } from '@/types/file';
import { ShowFilesProps } from './utils/interface';
import { useUserStore } from '@/store/slices';
import { cdn_service_url } from '@/env.config';
import { allowedAudioTypesConst, allowedImageTypesConst } from '@/types';
import AudioPlayer from './components/AudioPlayer';
import ImageViewer from './components/imageViewer';
import { useRef, useState, useEffect } from 'react';

const showFiles = ({ resources = [], removeFile }: ShowFilesProps) => {
  const { getTenant, getCompanyId } = useUserStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(1);
  const [startIdx, setStartIdx] = useState(0);

  const getUrl = (file: IPresignedRequest) => {
    return `${cdn_service_url}/${getTenant()}/${getCompanyId()}/${file.area}/${file.uuid}-${file.name}`;
  };

  useEffect(() => {
    const handleResize = () => {
      const el = containerRef.current;
      if (!el) return;
      const fileWidth = 80;
      const count = Math.max(1, Math.floor(el.offsetWidth / fileWidth));
      setVisibleCount(count);
      setStartIdx((prev) => Math.min(prev, Math.max(0, resources.length - count)));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [resources.length]);

  useEffect(() => {
    setStartIdx((prev) => Math.min(prev, Math.max(0, resources.length - visibleCount)));
  }, [resources.length, visibleCount]);

  const showLeft = startIdx > 0;
  const showRight = startIdx + visibleCount < resources.length;
  const goLeft = () => setStartIdx((prev) => Math.max(0, prev - 1));
  const goRight = () => setStartIdx((prev) => Math.min(resources.length - visibleCount, prev + 1));
  const visibleFiles = resources.slice(startIdx, startIdx + visibleCount);

  return (
    <div className='relative w-full flex justify-center items-center' ref={containerRef}>
      {showLeft && (
        <button
          className='absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-900/80 rounded-full p-1 shadow hover:bg-white dark:hover:bg-gray-800 transition'
          onClick={goLeft}
          aria-label='Ver anterior'
        >
          <span className='vox-icon vx-icon-003' />
        </button>
      )}
      {showRight && (
        <button
          className='absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-900/80 rounded-full p-1 shadow hover:bg-white dark:hover:bg-gray-800 transition'
          onClick={goRight}
          aria-label='Ver siguiente'
        >
          <span className='vox-icon vx-icon-004' />
        </button>
      )}
      <div
        className='flex flex-row flex-nowrap py-1 w-full gap-2 justify-center items-center px-8 overflow-hidden'
        style={{ minHeight: '3.5rem' }}
      >
        {visibleFiles.map((file) => (
          <div
            className='bg-contain dark:bg-gray-800 h-12 border rounded-md dark:border-b-dark-dark border-b-light-dark content-center text-center relative min-w-[3rem] max-w-[6rem] flex-shrink-0 mx-auto'
            key={file.uuid}
          >
            {allowedImageTypesConst.includes(file.type as any) ? (
              <ImageViewer src={getUrl(file)} />
            ) : allowedAudioTypesConst.includes(file.type as any) ? (
              <AudioPlayer src={getUrl(file)} />
            ) : (
              <span className='vox-icon vx-icon-069 px-3' />
            )}

            {removeFile && (
              <span
                className='absolute vox-icon vx-icon-008 size-sm top-0 right-0 cursor-pointer'
                onClick={() => removeFile(file.uuid)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default showFiles;
