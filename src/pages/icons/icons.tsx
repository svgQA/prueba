import { getStatusIconsPage, toggleIconsPage } from '@/store/signals/modals';
import IconsList from './icons.json';
import { useState } from 'react';

export const IconsPage = () => {
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);

  const copyToClipboard = (iconName: string) => {
    navigator.clipboard.writeText(`<span className="vox-icon ${iconName}" />`);
    setCopiedIcon(iconName);
    setTimeout(() => setCopiedIcon(null), 2000);
  };

  const onSelectElement = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const iconDiv = target.closest('div[name]');
    if (iconDiv) {
      const iconName = iconDiv.getAttribute('name');
      if (iconName) {
        copyToClipboard(iconName);
      }
    }
  };
  return (
    <div className=' bg-red-200'>
      <button
        className='fixed top-1/2 right-0 bg-teal-600 text-white z-30'
        onClick={toggleIconsPage}
      >
        <span className='vx-icon vx-users'></span> {getStatusIconsPage.value}
      </button>
      <div
        className={`${getStatusIconsPage.value ? 'invisible' : 'visible'} z-20 absolute w-screen h-full bg-gray-600 bg-opacity-95 top-0 flex justify-center items-center`}
      >
        <div
          className='bg-zinc-50 w-11/12 h-5/6 rounded-md shadow-md text-black flex flex-row flex-wrap gap-x-1 gap-y-0 p-3 relative'
          onClick={onSelectElement}
        >
          <div
            className={`${copiedIcon ? 'visible' : 'invisible'} absolute bottom-2 right-2 bg-teal-600 text-white px-4 py-2 rounded-md min-w-72`}
          >
            Copiado: {copiedIcon}
          </div>{' '}
          {IconsList.map((icon) => (
            <div
              key={icon.name}
              name={icon.name}
              className='h-13 px-3 cursor-pointer hover:bg-teal-600 hover:text-white rounded-md'
            >
              <span className={`vox-icon ${icon.name}`} />
              <p className='text-xs'>{icon.number}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
