import { useSignal } from '@preact/signals';
import { PropsWithChildren } from 'preact/compat';

interface TabContainerProps extends PropsWithChildren {
  children: React.ReactNode;
  className?: string;
}

export const TabContainer = ({ children, className }: TabContainerProps) => {
  const activeTab = useSignal(0);
  const tabs = Array.isArray(children) ? children : [children];
  const onClick = (pos: number) => {
    activeTab.value = pos;
  };
  return (
    <div className={className}>
      <div className='flex w-full flex-row'>
        {tabs.map((tab: any, index: number) => (
          <div
            className={`flex-1 text-center px-4 py-2 cursor-pointer hover:bg-b-light-dark hover:dark:bg-b-dark-light hover ${
              index === activeTab.value ? 'border-b-4 border-primary' : ''
            }`}
            key={`format-tab-${tab.props.title}`}
            onClick={() => onClick(index)}
          >
            {tab.props.title}
          </div>
        ))}
      </div>
      {tabs.map((tab: any, index: number) => (
        <div
          className={`${
            index === activeTab.value ? 'flex opacity-100' : 'hidden opacity-0'
          } w-full transition-opacity duration-300 ease-in-out mt-3`}
        >
          {tab.props.children}
        </div>
      ))}
    </div>
  );
};
