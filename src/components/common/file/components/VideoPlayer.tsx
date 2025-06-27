import { useRef } from 'preact/hooks';
import Viewer from './viewer';

export const VideoPlayer = ({
  src,
  poster,
}: {
  src: string;
  poster?: string;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const closeVideoViewer = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const posterSpan = (
    <video
      src={src}
      poster={poster}
      preload='metadata'
      style={{
        width: 64,
        height: 48,
        objectFit: 'cover',
        borderRadius: 8,
        boxShadow: '0 2px 8px #0003',
      }}
      tabIndex={-1}
      muted
      playsInline
      onClick={(e) => e.preventDefault()}
    />
  );

  const infoExpanded = (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      controls
      autoPlay
      style={{
        maxHeight: '80vh',
        maxWidth: '90vw',
        borderRadius: 8,
        boxShadow: '0 2px 16px #0008',
        background: '#000',
      }}
      onClick={(e) => e.stopPropagation()}
    />
  );

  return (
    <Viewer
      posterSpan={posterSpan}
      infoExpanded={infoExpanded}
      close={closeVideoViewer}
    />
  );
};
