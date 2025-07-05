import { useEffect } from 'preact/compat';
import { TargetedEvent } from 'preact/compat';
import { getReport, ReportKey, updateReport } from './store/report';
import { FormService } from '@/services';
import { ELEMENT_PDF_SIZES, ELEMENT_THUMBNAIL_SIZES } from './constant';
import { CardDropzone } from './components/card.image';
import { CardReport } from './components/card.page';
import { useLocation } from 'wouter';
import { PAGES_LIST_ROUTER } from '@/utils/routing';
import { Input } from '@/components/common/input/input';
import { Select } from '@/components/common/select/select';
import { Switch } from '@/components/common/switch/switch';
import { Button } from '@/components/common/button/button';
import { TabContainer } from '@/components/common/tab/container';
import { Tab } from '@/components/common/tab/tab';
import { handleChange } from '@/components/utils/input';
import { useTranslation } from 'react-i18next';

export const FormReportSettingPage = () => {
  const { t } = useTranslation();
  const [_, navigate] = useLocation();

  useEffect(() => {
    document.title = t('p_report');
  }, []);

  const handleInputChange = (
    e: TargetedEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    e.stopPropagation();
    const model = handleChange(e);
    if (!model.name) return;
    updateReport(model.name as ReportKey, model.value);
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
            onChange={handleInputChange}
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
                  name='coverPage'
                  icon='009'
                  onChange={handleInputChange}
                  value={getReport.value.coverPage}
                  description='Drop your cover page file here or click to browse'
                />
              </div>

              <div className='space-y-3'>
                <h3 className='text-lg font-medium'>Logo</h3>
                <CardDropzone
                  name='logoPage'
                  icon='010'
                  onChange={handleInputChange}
                  value={getReport.value.logoPage}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                  options={ELEMENT_THUMBNAIL_SIZES}
                />
              </div>
            </div>
          </Tab>
          <Tab title='Content'>
            <div className='w-full space-y-4 px-4 flex flex-col'>
              <Switch
                id='cb-report-header'
                name='header'
                label='Header'
                value={getReport.value.header}
                onChange={handleInputChange}
              />
              <Switch
                id='cb-report-footer'
                name='footer'
                label='Footer'
                value={getReport.value.footer}
                onChange={handleInputChange}
              />
              <Switch
                id='cb-report-page-break'
                name='pageBreak'
                label='Page Break'
                value={getReport.value.pageBreak}
                onChange={handleInputChange}
              />
              <Switch
                id='cb-report-flagged-items'
                name='flaggedItems'
                label='Flagged Items'
                value={getReport.value.flaggedItems}
                onChange={handleInputChange}
              />
              <Switch
                id='cb-report-actions'
                name='actions'
                label='Actions'
                value={getReport.value.actions}
                onChange={handleInputChange}
              />
              <Switch
                id='cb-report-disclaimer'
                name='disclaimer'
                label='Disclaimer'
                value={getReport.value.disclaimer}
                onChange={handleInputChange}
              />
              <Switch
                id='cb-report-media-summary'
                name='mediaSummary'
                label='Media Summary'
                value={getReport.value.mediaSummary}
                onChange={handleInputChange}
              />
            </div>
          </Tab>
        </TabContainer>
      </div>
      <CardReport
        menu={
          <Button
            name='btn-safe-format'
            id='btn-safe-format'
            type='button'
            label={getReport.value.id ? 'Update' : 'Save'}
            icon='156'
            end
            onClick={saveReport}
          />
        }
      />
    </div>
  );
};
