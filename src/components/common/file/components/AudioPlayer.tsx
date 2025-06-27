import { useRef, useState, useEffect } from 'preact/hooks';
import './file.css';

interface AudioAvatarPlayerProps {
  src: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'auto';
  square?: boolean;
}

// const sizeMap = {
//   sm: 'min-w-8 max-w-8 min-h-8 max-h-8 text-base',
//   md: 'min-w-12 max-w-12 min-h-12 max-h-12 text-xl',
//   lg: 'min-w-20 max-w-20 min-h-20 max-h-20 text-3xl',
//   xl: 'min-w-32 max-w-32 min-h-32 max-h-32 text-5xl',
//   auto: 'w-full h-full',
// };

export const AudioPlayer = ({
  src,
  // size = 'md',
  // square = false,
}: AudioAvatarPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    isPlaying ? audio.pause() : audio.play();
  };

  // const shapeClass = square ? 'rounded' : 'rounded-full';
  // const baseClasses = `
  //   flex items-center justify-center ${shapeClass} overflow-hidden relative bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold
  //   ${sizeMap[size] || sizeMap.md} cursor-pointer select-none`;

  return (
    <div onClick={togglePlay}>
      <audio ref={audioRef} src={src} preload='auto' />

      <div className='absolute inset-0 bg-black/10 flex items-center justify-center'>
        {isPlaying ? (
          <div className='flex gap-0.5 items-end h-6'>
            <span className='w-1 h-2 bg-white animate-wave1 rounded-full' />
            <span className='w-1 h-4 bg-white animate-wave2 rounded-full' />
            <span className='w-1 h-3 bg-white animate-wave3 rounded-full' />
            <span className='w-1 h-5 bg-white animate-wave1 rounded-full' />
          </div>
        ) : (
          <span className='vx-icon vx-icon-069 px-3 font-light text-black dark:text-white' />
        )}
      </div>
    </div>
  );
};
