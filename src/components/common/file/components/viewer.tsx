import React, { useState } from 'preact/compat';

interface IViewerProps {
  posterSpan: React.ReactNode;
  infoExpanded: React.ReactNode;
  close?: () => void;
}

const Viewer = ({ posterSpan, infoExpanded, close }: IViewerProps) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const openViewer = () => setIsViewerOpen(true);

  const closeViewer = () => {
    setIsViewerOpen(false);
    close?.();
  };

  return (
    <>
      <span onClick={openViewer} style={{ cursor: 'pointer' }}>
        {posterSpan}
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
          onClick={closeViewer}
        >
          {infoExpanded}
          <button
            onClick={closeViewer}
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
            aria-label='Cerrar'
          >
            &times;
          </button>
        </div>
      )}
    </>
  );
};

export default Viewer;
