import { Button, Input, Select, Switch } from '@/components/common';
import { useSignal } from '@preact/signals';
import { PropsWithChildren, useEffect } from 'preact/compat';
import { TargetedEvent } from 'preact/compat';
import { getReport, ReportKey, updateReport } from './store/report';
import { FormService } from '@/services';
import { ELEMENT_PDF_SIZES, ELEMENT_THUMBNAIL_SIZES } from './constant';
import { CardDropzone } from './components/card.image';
import { CardReport } from './components/card.page';
import { useLocation } from 'wouter';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

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

export const FormReportSettingPage = () => {
  const [_, navigate] = useLocation();
  useEffect(() => {
    document.title = 'Forms Create Report';
  }, []);

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
    if (!getReport.value.id) {
      const response = await FormService.create_report(getReport.value);
      if (!response.getStatus()) return;
    } else {
      const response = await FormService.update_report(
        getReport.value,
        getReport.value.id
      );
      if (!response.getStatus()) return;
    }
    navigate(PAGES_LIST_ROUTER.dashboard.setting.forms.form.to);
  };

  return (
    <div className='flex w-full mt-3'>
      <div className='w-[25%] flex flex-col vox-scroll-design overflow-y-auto'>
        <div className='space-y-2'>
          <Input
            name='title'
            id='in-title-format'
            placeholder='Name Format'
            onChange={handleChange}
            value={getReport.value.title}
            icon='132'
          />
        </div>
        <TabContainer className='w-full min-h-[50vh]'>
          <Tab title='Style'>
            <div className='w-full space-y-2 px-2'>
              <div className='space-y-3'>
                <h3 className='text-lg font-medium'>Cover Page</h3>
                <CardDropzone
                  icon='009'
                  description='Drop your cover page file here or click to browse'
                />
              </div>

              <div className='space-y-3'>
                <h3 className='text-lg font-medium'>Logo</h3>
                <CardDropzone
                  icon='010'
                  description='Drop your logo here or click to upload'
                />
              </div>

              <div className='space-y-3'>
                <h3 className='text-lg font-medium'>PDF Size</h3>
                <Select
                  placeholder='Type Element'
                  id='se-form-report-pdfsize'
                  icon='106'
                  value={getReport.value.pdfSize}
                  name='pdfSize'
                  onChange={handleChange}
                  options={ELEMENT_PDF_SIZES}
                />
              </div>

              <div className='space-y-3'>
                <h3 className='text-lg font-medium'>Thumbnail Size</h3>
                <Select
                  placeholder='Type Element'
                  id='se-form-report-thumbnailSize'
                  icon='106'
                  value={getReport.value.thumbnailSize}
                  name='thumbnailSize'
                  onChange={handleChange}
                  options={ELEMENT_THUMBNAIL_SIZES}
                />
              </div>
            </div>
          </Tab>
          <Tab title='Content'>
            <div className='w-full space-y-4 px-4'>
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
      <div className='w-[75%] px-4'>
        <div className='flex justify-between items-center mb-3'>
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
              icon='076'
            />
            {/*
              className={`${viewMode.value === 'web' ? 'bg-primary' : 'bg-gray-200'}`}
              onClick={() => (viewMode.value = 'web')}
            */}
            <Button
              name='btn-safe-format'
              id='btn-safe-format'
              type='button'
              label={getReport.value.id ? 'Update' : 'Save'}
              icon='156'
              end
              onClick={saveReport}
            />
          </div>
        </div>
        <CardReport />
      </div>
    </div>
  );
};
