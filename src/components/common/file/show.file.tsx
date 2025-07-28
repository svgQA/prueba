import { IPresignedRequest } from '@/types/file';
import { ShowFilesProps } from './utils/interface';
import { useUserStore } from '@/store/slices';
import { cdn_service_url } from '@/env.config';
import {
  allowedAudioTypesConst,
  allowedImageTypesConst,
  allowedVideoTypesConst,
} from '@/types';
import { AudioPlayer } from './components/AudioPlayer';
import { ImageViewer } from './components/imageViewer';
import { useRef, useState, useEffect } from 'react';
import { Button } from '../button/button';
import { VideoPlayer } from './components/VideoPlayer';
import MapViewer from './components/mapViewer';
import MapPathViewer from './components/mapPathViewer';

const showFiles = ({
  resources = [],
  isSender = false,
  removeFile,
  mapPoint,
}: ShowFilesProps) => {
  const { getTenant, getCompanyId } = useUserStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(1);
  const [startIdx, setStartIdx] = useState(0);

  const getUrl = (file: IPresignedRequest) => {
    const validation = `${cdn_service_url}/${getTenant()}/${getCompanyId()}/${file.area}/${file.uuid}-${file.name}`;
    console.log('validation', validation);
    return validation;
  };

  useEffect(() => {
    const handleResize = () => {
      const el = containerRef.current;
      if (!el) return;
      const fileWidth = 80;
      const count = Math.max(1, Math.floor(el.offsetWidth / fileWidth));
      setVisibleCount(count);
      setStartIdx((prev) =>
        Math.min(prev, Math.max(0, resources.length - count))
      );
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [resources.length]);

  useEffect(() => {
    setStartIdx((prev) =>
      Math.min(prev, Math.max(0, resources.length - visibleCount))
    );
  }, [resources.length, visibleCount]);

  const showLeft = startIdx > 0;
  const showRight = startIdx + visibleCount < resources.length;
  const goLeft = () => setStartIdx((prev) => Math.max(0, prev - 1));
  const goRight = () =>
    setStartIdx((prev) => Math.min(resources.length - visibleCount, prev + 1));
  const visibleFiles = resources.slice(startIdx, startIdx + visibleCount);

  return (
    <div
      className='relative w-full flex justify-center items-center'
      ref={containerRef}
    >
      {visibleFiles && resources.length > 0 && (
        <Button
          name='button-change-scheduler'
          onClick={goLeft}
          icon='003'
          borderless
          square
          transparent
          disabled={!showLeft}
        ></Button>
      )}
      <div
        className={`flex flex-row flex-nowrap py-1 w-full gap-2 ${isSender ? 'justify-end items-center' : 'justify-start items-center'} px-8 overflow-hidden`}
        style={{ minHeight: '3.5rem' }}
      >
        {visibleFiles.map((file) => (
          <div
            className='
            border border-b-light-dark dark:border-b-dark-light py-4 relative bg-gray-200
            dark:bg-gray-800/60 text-gray-700 dark:text-gray-200 font-bold overflow-hidden rounded-md
            flex flex-row justify-center items-center cursor-pointer h-[50px] w-[50px]
            '
            key={file.uuid}
          >
            {allowedImageTypesConst.includes(file.type as any) ? (
              <ImageViewer src={getUrl(file)} />
            ) : allowedAudioTypesConst.includes(file.type as any) ? (
              <AudioPlayer src={getUrl(file)} square />
            ) : allowedVideoTypesConst.includes(file.type as any) ? (
              <VideoPlayer src={getUrl(file)} />
            ) : file.type === 'application/json' ? (
              <MapPathViewer src={getUrl(file)} />
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
        {mapPoint && <MapViewer mapPoint={mapPoint} />}
      </div>
      {visibleFiles && resources.length > 0 && (
        <Button
          name='button-change-scheduler'
          onClick={goRight}
          icon='004'
          borderless
          square
          transparent
          disabled={!showRight}
        ></Button>
      )}
    </div>
  );
};

export default showFiles;
