import { Button, Input, Switch } from '@/components/common';
import { useSignal } from '@preact/signals';
import { PropsWithChildren } from 'preact/compat';

interface TabProps extends PropsWithChildren {
  title: string;
  isActive?: boolean;
  onClick?: () => void;
}

const Tab = (_: TabProps) => {
  return <></>;
};

interface TabContainerProps extends PropsWithChildren {
  children: React.ReactNode;
  className?: string;
}

const TabContainer = ({ children, className }: TabContainerProps) => {
  const activeTab = useSignal(0);
  const tabs = Array.isArray(children) ? children : [children];
  const onClick = (pos: number) => {
    activeTab.value = pos;
  };
  return (
    <div className={className}>
      <div className='flex w-full flex-row border-b'>
        {tabs.map((tab: any, index: number) => (
          <div
            className={`flex-1 text-center px-4 py-2 cursor-pointer hover:bg-gray-100 ${
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

export const FormReportSettingPage = () => {
  const viewMode = useSignal('pdf');

  return (
    <div className='flex w-full mt-3'>
      <div className='w-[25%] flex flex-col vox-scroll-design overflow-y-auto'>
        <div className='space-y-2'>
          <h2 className='text-xl font-bold'>New Format</h2>
          <Input
            name='title-format'
            id='in-title-format'
            placeholder='Name Format'
            borderless
          />
        </div>
        <TabContainer className='w-full min-h-[50vh]'>
          <Tab title='Style'>
            <div className='w-full space-y-2'>
              <div className='space-y-3'>
                <div className='flex items-center gap-2'>
                  <i className='fas fa-file-alt text-gray-600'></i>
                  <h3 className='text-lg font-medium'>Cover Page</h3>
                </div>
                <div className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer'>
                  <i className='fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2'></i>
                  <p className='text-gray-600'>
                    Drop your cover page file here or click to browse
                  </p>
                  <input type='file' className='hidden' />
                </div>
              </div>

              <div className='space-y-3'>
                <div className='flex items-center gap-2'>
                  <i className='fas fa-image text-gray-600'></i>
                  <h3 className='text-lg font-medium'>Logo</h3>
                </div>
                <div className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer'>
                  <i className='fas fa-upload text-3xl text-gray-400 mb-2'></i>
                  <p className='text-gray-600'>
                    Drop your logo here or click to upload
                  </p>
                  <input type='file' accept='image/*' className='hidden' />
                </div>
              </div>

              <div className='space-y-3'>
                <div className='flex items-center gap-2'>
                  <i className='fas fa-expand-arrows-alt text-gray-600'></i>
                  <h3 className='text-lg font-medium'>PDF Size</h3>
                </div>
                <select className='w-full p-2 border rounded-lg'>
                  <option value='a4'>A4</option>
                  <option value='letter'>US Letter</option>
                </select>
              </div>

              <div className='space-y-3'>
                <div className='flex items-center gap-2'>
                  <i className='fas fa-compress-arrows-alt text-gray-600'></i>
                  <h3 className='text-lg font-medium'>Thumbnail Size</h3>
                </div>
                <div className='grid grid-cols-3 gap-3'>
                  <div className='border rounded-lg p-3 text-center cursor-pointer hover:bg-gray-50'>
                    Small
                  </div>
                  <div className='border rounded-lg p-3 text-center cursor-pointer hover:bg-gray-50'>
                    Medium
                  </div>
                  <div className='border rounded-lg p-3 text-center cursor-pointer hover:bg-gray-50'>
                    Large
                  </div>
                </div>
              </div>
            </div>
          </Tab>
          <Tab title='Content'>
            <div className='w-full space-y-2'>
              <Switch id='cb-form-header' name='header' label='Header' />
              <Switch id='cb-form-footer' name='footer' label='Footer' />
              <Switch
                id='cb-form-page-break'
                name='pageBreak'
                label='Page Break'
              />
              <Switch
                id='cb-form-flagged-items'
                name='flaggedItems'
                label='Flagged Items'
              />
              <Switch id='cb-form-actions' name='actions' label='Actions' />
              <Switch
                id='cb-form-disclaimer'
                name='disclaimer'
                label='Disclaimer'
              />
              <Switch
                id='cb-form-media-summary'
                name='mediaSummary'
                label='Media Summary'
              />
            </div>
          </Tab>
          {/*
          <Tab title='Template'>
            <div className='w-full'>Email template settings here</div>
          </Tab>
          */}
        </TabContainer>
        <div className='space-y-2 w-full flex absolute bottom-0 left-4'>
          <Button
            name='button-safe-format'
            id='button-safe-format'
            className='w-80 bg-primary'
            type='button'
            label='Save'
            icon='456'
          />
        </div>
      </div>
      <div className='w-[75%] p-4'>
        <div className='flex justify-between items-center mb-6 border-b pb-4'>
          <h1 className='text-2xl font-bold'>Report</h1>
          <div className='space-x-2'>
            <Button
              name='pdf-view'
              type='button'
              label='PDF View'
              className={`${viewMode.value === 'pdf' ? 'bg-primary' : 'bg-gray-200'}`}
              onClick={() => (viewMode.value = 'pdf')}
            />
            <Button
              name='web-view'
              type='button'
              label='Web View'
              className={`${viewMode.value === 'web' ? 'bg-primary' : 'bg-gray-200'}`}
              onClick={() => (viewMode.value = 'web')}
            />
          </div>
        </div>
        <div className='bg-white shadow-lg p-8 w-full vox-scroll-design overflow-y-auto max-h-[70vh]'>
          <div className='space-y-6'>
            <div className='border-b pb-4'>
              <h2 className='text-xl font-bold mb-2'>Company Name</h2>
              <p className='text-gray-600'>123 Business Street</p>
              <p className='text-gray-600'>City, State 12345</p>
            </div>

            <div className='space-y-4'>
              <h3 className='text-lg font-semibold'>Report Details</h3>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-gray-600'>
                    Date: {new Date().toLocaleDateString()}
                  </p>
                  <p className='text-gray-600'>Report ID: REP-2023-001</p>
                </div>
                <div>
                  <p className='text-gray-600'>Department: Sales</p>
                  <p className='text-gray-600'>Generated by: John Doe</p>
                </div>
              </div>
            </div>

            <div className='space-y-4'>
              <h3 className='text-lg font-semibold'>Summary</h3>
              <p className='text-gray-700'>
                This is an example report summary with sample content. The
                actual content will be populated based on the selected template
                and configuration.
              </p>
            </div>

            <table className='w-full border-collapse'>
              <thead>
                <tr className='bg-gray-50'>
                  <th className='border p-2 text-left'>Item</th>
                  <th className='border p-2 text-left'>Description</th>
                  <th className='border p-2 text-right'>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='border p-2'>Item 1</td>
                  <td className='border p-2'>Description for item 1</td>
                  <td className='border p-2 text-right'>$100.00</td>
                </tr>
                <tr>
                  <td className='border p-2'>Item 2</td>
                  <td className='border p-2'>Description for item 2</td>
                  <td className='border p-2 text-right'>$150.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
