import { Table } from '@/components/common';
import { useLocation } from 'wouter';
import { columns } from './components';
import { useEffect } from 'preact/hooks';
import { FormService } from '@/services';
import { useSignal } from '@preact/signals';
import { IFormResponse } from '@/types/form';
import { IRowAction, ROW_ACTIONS } from '@/components/common/interface';
import { FORMAT_MODE_SERVICE, setFormat } from '../create/store';
import { CardMenu } from './components/card.menu';
import { PAGES_LIST_ROUTER } from '@/utils/routing';
import { appendHistory } from '../../store';
import { RESPONSE_MODE_SERVICE, setResponse } from '../response/store/response';
import { setReport, updateReport } from '../report/store/report';

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
        console.log('ELIMINAR ESTA VUELTA');
        break;
      }
      case ROW_ACTIONS.RESPONSE: {
        const menu = {
          to: PAGES_LIST_ROUTER.dashboard.setting.forms.response.to,
          label: 'response',
          id: 'form-response',
        };
        appendHistory(menu);
        setResponse({ mode: RESPONSE_MODE_SERVICE.CREATE }, format.structure);
        navigate(menu.to);
        break;
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
    <section className='pt-5'>
      <div class='flex flex-col gap-2 justify-center mb-5 p-2 rounded bg-b-light-dark dark:bg-b-dark-light'>
        <div className='flex flex-row justify-center space-x-3'>
          <CardMenu
            menu={{
              to: PAGES_LIST_ROUTER.dashboard.setting.forms.create.to,
              label: 'create',
              id: 'form-create',
            }}
            title='Start from scratch'
            description='Get started with a blank template'
            icon='123'
            event={() => setFormat({ mode: FORMAT_MODE_SERVICE.CREATE })}
          />
        </div>
      </div>
      <Table<IFormResponse>
        data={forms.value}
        columns={columns}
        pageSize={20}
        onClickAction={handleOnClick}
        unsearch
      />
    </section>
  );
};
