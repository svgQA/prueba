import { useRef, useState } from 'preact/hooks';

export const VideoPlayer = ({
  src,
  poster,
}: {
  src: string;
  poster?: string;
}) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const openVideoViewer = () => setIsViewerOpen(true);
  const closeVideoViewer = () => {
    setIsViewerOpen(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <>
      <span onClick={openVideoViewer} style={{ cursor: 'pointer' }}>
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
      </span>
      {isViewerOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.9)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={closeVideoViewer}
        >
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
          <button
            onClick={closeVideoViewer}
            style={{
              position: 'absolute',
              top: 24,
              right: 32,
              fontSize: 32,
              color: '#fff',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              zIndex: 10001,
            }}
            aria-label='Cerrar video'
          >
            &times;
          </button>
        </div>
      )}
    </>
  );
};
