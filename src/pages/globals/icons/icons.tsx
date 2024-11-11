import { getStatusIconsPage, toggleIconsPage } from '@/store/signals/modals';
import IconsList from './icons.json';
import { useState, useCallback, memo } from 'preact/compat';

const Icon = memo(({ name, number }: { name: string; number: string }) => (
  <div
    name={name}
    className='h-13 px-3 cursor-pointer hover:bg-teal-600 hover:text-white rounded-md'
  >
    <span className={`vox-icon ${name}`} />
    <p className='text-xs'>{number}</p>
  </div>
));

export const IconsModal = () => {
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);

  const copyToClipboard = useCallback((iconName: string) => {
    navigator.clipboard.writeText(`<span className="vox-icon ${iconName}" />`);
    setCopiedIcon(iconName);
    setTimeout(() => setCopiedIcon(null), 2000);
  }, []);

  const onSelectElement = useCallback(
    (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const iconDiv = target.closest('div[name]');
      if (iconDiv) {
        const iconName = iconDiv.getAttribute('name');
        if (iconName) {
          copyToClipboard(iconName);
        }
      }
    },
    [copyToClipboard]
  );

  return (
    <div className='bg-red-200'>
      <button className='fixed top-1/2 right-0 z-30' onClick={toggleIconsPage}>
        <span className='vox-icon vx-icon-009' /> {getStatusIconsPage.value}
      </button>
      <div
        className={`${getStatusIconsPage.value ? 'visible' : 'invisible'} z-20 absolute w-screen h-full bg-gray-600 bg-opacity-95 top-0 flex justify-center items-center`}
      >
        <div
          className='bg-zinc-50 w-11/12 h-5/6 overflow-y-scroll rounded-md shadow-md text-black flex flex-row flex-wrap gap-x-0.5 gap-y-0 p-3 relative vox-scroll-design'
          onClick={onSelectElement}
        >
          <div
            className={`${copiedIcon ? 'visible' : 'invisible'} absolute bottom-2 right-2 bg-teal-600 text-white px-4 py-2 rounded-md min-w-72`}
          >
            Copiado: {copiedIcon}
          </div>{' '}
          {IconsList.map((icon) => (
            <Icon key={icon.name} name={icon.name} number={icon.number} />
          ))}
        </div>
      </div>
    </div>
  );
};
