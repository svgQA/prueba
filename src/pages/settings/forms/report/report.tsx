import { Button, Input, Switch } from '@/components/common';
import { useSignal } from '@preact/signals';
import { PropsWithChildren } from 'preact/compat';
import { TargetedEvent } from 'preact/compat';
import { getReport, ReportKey, updateReport } from './store';
import { IReportRequest } from '@/types/form';
import { FormService } from '@/services';

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
  const handleChange = (
    e: TargetedEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.currentTarget;
    const vout =
      type === 'checkbox'
        ? (e.currentTarget as HTMLInputElement).checked
        : value;
    if (!name || !value) return;
    updateReport(name as ReportKey, vout);
  };

  const saveReport = async () => {
    const report: IReportRequest = {
      title: getReport.value.title,
      description: getReport.value.title,
      structure: getReport.value,
    };
    const response = await FormService.create_report(report);
    if (!response.getStatus()) return;
  };

  return (
    <div className='flex w-full mt-3'>
      <div className='w-[25%] flex flex-col vox-scroll-design overflow-y-auto'>
        <div className='space-y-2'>
          <h2 className='text-xl font-bold'>New Format</h2>
          <Input
            name='title'
            id='in-title-format'
            placeholder='Name Format'
            borderless
            onChange={handleChange}
            value={getReport.value.title}
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
                  <input type='file' name='coverPage' className='hidden' />
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
                  <input
                    type='file'
                    name='logo'
                    accept='image/*'
                    className='hidden'
                  />
                </div>
              </div>

              <div className='space-y-3'>
                <div className='flex items-center gap-2'>
                  <i className='fas fa-expand-arrows-alt text-gray-600'></i>
                  <h3 className='text-lg font-medium'>PDF Size</h3>
                </div>
                <select
                  name='pdfSize'
                  className='w-full p-2 border rounded-lg'
                  value={getReport.value.pdfSize}
                  onChange={handleChange}
                >
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
                  <div
                    className='border rounded-lg p-3 text-center cursor-pointer hover:bg-gray-50'
                    onClick={() => {
                      const event = new Event('change') as any;
                      event.currentTarget = {
                        name: 'thumbnailSize',
                        value: 'small',
                      };
                      handleChange(event);
                    }}
                  >
                    Small
                  </div>
                  <div
                    className='border rounded-lg p-3 text-center cursor-pointer hover:bg-gray-50'
                    onClick={() => {
                      const event = new Event('change') as any;
                      event.currentTarget = {
                        name: 'thumbnailSize',
                        value: 'medium',
                      };
                      handleChange(event);
                    }}
                  >
                    Medium
                  </div>
                  <div
                    className='border rounded-lg p-3 text-center cursor-pointer hover:bg-gray-50'
                    onClick={() => {
                      const event = new Event('change') as any;
                      event.currentTarget = {
                        name: 'thumbnailSize',
                        value: 'large',
                      };
                      handleChange(event);
                    }}
                  >
                    Large
                  </div>
                </div>
              </div>
            </div>
          </Tab>
          <Tab title='Content'>
            <div className='w-full space-y-2'>
              <Switch
                id='cb-form-header'
                name='header'
                label='Header'
                value={getReport.value.header}
                onChange={handleChange}
              />
              <Switch
                id='cb-form-footer'
                name='footer'
                label='Footer'
                value={getReport.value.footer}
                onChange={handleChange}
              />
              <Switch
                id='cb-form-page-break'
                name='pageBreak'
                label='Page Break'
                value={getReport.value.pageBreak}
                onChange={handleChange}
              />
              <Switch
                id='cb-form-flagged-items'
                name='flaggedItems'
                label='Flagged Items'
                value={getReport.value.flaggedItems}
                onChange={handleChange}
              />
              <Switch
                id='cb-form-actions'
                name='actions'
                label='Actions'
                value={getReport.value.actions}
                onChange={handleChange}
              />
              <Switch
                id='cb-form-disclaimer'
                name='disclaimer'
                label='Disclaimer'
                value={getReport.value.disclaimer}
                onChange={handleChange}
              />
              <Switch
                id='cb-form-media-summary'
                name='mediaSummary'
                label='Media Summary'
                value={getReport.value.mediaSummary}
                onChange={handleChange}
              />
            </div>
          </Tab>
        </TabContainer>
      </div>
      <div className='w-[75%] p-4'>
        <div className='flex justify-between items-center mb-6 border-b pb-4'>
          <h1 className='text-2xl font-bold'>Report</h1>
          <div className='space-x-2'>
            <Button
              name='btn-pdf-view'
              id='btn-pdf-view'
              type='button'
              label='PDF View'
              icon='156'
            />
            {/*
              className={`${viewMode.value === 'pdf' ? 'bg-primary' : 'bg-gray-200'}`}
              onClick={() => (viewMode.value = 'pdf')}
            */}
            <Button
              name='btn-web-view'
              id='btn-web-view'
              type='button'
              label='Web View'
              icon='056'
            />
            {/*
              className={`${viewMode.value === 'web' ? 'bg-primary' : 'bg-gray-200'}`}
              onClick={() => (viewMode.value = 'web')}
            */}
            <Button
              name='btn-safe-format'
              id='btn-safe-format'
              type='button'
              label='Save'
              icon='156'
              onClick={saveReport}
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
