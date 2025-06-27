import { Avatar } from '../../Avatar';
import { useState } from 'react';

export const ImageViewer = ({ src }: { src: string }) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const openImageViewer = () => {
    setIsViewerOpen(true);
  };
  const closeImageViewer = () => {
    setIsViewerOpen(false);
  };

  return (
    <>
      <span onClick={openImageViewer} style={{ cursor: 'pointer' }}>
        <Avatar src={src} name='Image' square />
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
          onClick={closeImageViewer}
        >
          <img
            src={src}
            alt='image-viewer'
            style={{
              maxHeight: '80vh',
              maxWidth: '90vw',
              borderRadius: 8,
              boxShadow: '0 2px 16px #0008',
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={closeImageViewer}
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
          >
            &times;
          </button>
        </div>
      )}
    </>
  );
};
