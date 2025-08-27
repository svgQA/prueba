import { useState } from 'preact/hooks';

export const SvgViewer = ({ src }: { src: string }) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const openSvgViewer = () => {
    setIsViewerOpen(true);
  };

  const closeSvgViewer = () => {
    setIsViewerOpen(false);
  };

  const showSvg = (width = 60, height = 60) => (
    <div
      className='border rounded bg-white p-2 flex items-center justify-center cursor-pointer hover:bg-gray-50'
      style={{ width, height }}
      onClick={openSvgViewer}
    >
      <div
        style={{ width: '100%', height: '100%' }}
        dangerouslySetInnerHTML={{ __html: src }}
      />
    </div>
  );

  return (
    <>
      <div className='flex items-center gap-2 mt-2'>{showSvg()}</div>
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
          onClick={closeSvgViewer}
        >
          {showSvg(600, 500)}
          <button
            onClick={closeSvgViewer}
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
