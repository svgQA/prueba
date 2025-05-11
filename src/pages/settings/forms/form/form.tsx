import { useLocation } from 'wouter';
import { columns } from './components/form.columns';
import { useEffect } from 'preact/hooks';
import { FormService } from '@/services';
import { useSignal } from '@preact/signals';
import { IFormResponse } from '@/types/form';
import { PAGES_LIST_ROUTER } from '@/utils/routing';
import { setReport, updateReport } from '../report/store/report';
import { RESPONSE_MODE_SERVICE, setResponse } from '../response/store/response';
import { IRowAction } from '@/components/common/table/interface';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { FORMAT_MODE_SERVICE, setFormat } from '../create/store/question';
import { Table } from '@/components/common/table/table';
import { appendHistory } from '../../store/settings';
import { Section } from '@/components/common/section/section';
import { Button } from '@/components/common/button/button';
import i18n from '@/i18n';
export const FormSettingPage = () => {
  const forms = useSignal<IFormResponse[]>([]);
  const [_, navigate] = useLocation();

  useEffect(() => {
    getFormsHandler();
  }, []);

  const getFormsHandler = async () => {
    const response = await FormService.get_all();
    if (!response.getStatus()) return;
    forms.value = response.getMany();
  };

  const navigateReport = () => {
    const menu = {
      to: PAGES_LIST_ROUTER.dashboard.setting.forms.report.to,
      label: 'report',
      id: 'form-report',
    };
    appendHistory(menu);
    navigate(menu.to);
  };

  const navigateResponse = () => {
    const menu = {
      to: PAGES_LIST_ROUTER.dashboard.setting.forms.response.to,
      label: 'response',
      id: 'form-response',
    };
    appendHistory(menu);
    navigate(menu.to);
  };

  const redirect = () => {
    setFormat({ mode: FORMAT_MODE_SERVICE.CREATE });
    const menu = {
      to: PAGES_LIST_ROUTER.dashboard.setting.forms.create.to,
      label: 'create',
      id: 'form-create',
    };
    appendHistory(menu);
    navigate(menu.to);
  };

  const handleOnClick = async (action: IRowAction) => {
    const format = forms.value.find((format) => format.id == action.id);
    if (!format?.structure) throw Error('ERROR: Not exist format in this form');
    switch (action.action) {
      case ROW_ACTIONS.UPDATE: {
        const menu = {
          to: PAGES_LIST_ROUTER.dashboard.setting.forms.create.to,
          label: 'create',
          id: 'form-create',
        };
        appendHistory(menu);
        setFormat(
          { mode: FORMAT_MODE_SERVICE.UPDATE, id: format.id },
          format.structure
        );
        navigate(menu.to);
        break;
      }
      case ROW_ACTIONS.DELETE: {
        const response = await FormService.delete(format.id);
        if (!response.getStatus()) return;
        getFormsHandler();
        break;
      }
      case ROW_ACTIONS.RESPONSE: {
        const response = await FormService.create_response({
          formId: format.id,
          structure: format.structure,
        });
        if (!response.getStatus()) return;
        const responseModel = response.getOne();
        setResponse(
          { mode: RESPONSE_MODE_SERVICE.UPDATE, id: responseModel.id },
          responseModel.structure
        );
        return navigateResponse();
      }
      case ROW_ACTIONS.REPORT: {
        if (!format.report) {
          updateReport('formId', format.id);
          return navigateReport();
        }
        const response = await FormService.get_report_by_id(format.report.id);
        if (!response.getStatus()) {
          updateReport('formId', format.id);
        } else {
          setReport(response.getOne());
        }
        return navigateReport();
      }
      default:
        break;
    }
  };

  return (
    <Section>
      <div className='py-2 flex flex-row justify-between items-center overflow-visible xl:absolute relative z-50'>
        <div className='flex flex-row items-center justify-between'>
          <Button
            name='button-create-shift'
            label={i18n.t('form.new')}
            icon='039'
            onClick={redirect}
            className='px-6 py-1 text-sm font-medium rounded md:text-base h-fit items-center justify-center inline-flex bg-primary text-white border-none'
          />
        </div>
      </div>
      <Table<IFormResponse>
        data={forms.value}
        columns={columns}
        pageSize={10}
        onClickAction={handleOnClick}
        isSettingTable
      />
    </Section>
  );
};
