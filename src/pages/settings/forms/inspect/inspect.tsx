import { IResponseResponse } from '@/types/form';
import { useSignal } from '@preact/signals';
import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { useLocation } from 'wouter';
import { columns } from './components/inspect.columns';
import { FormService } from '@/services';
import { RESPONSE_MODE_SERVICE, setResponse } from '../response/store/response';
import { PAGES_LIST_ROUTER } from '@/utils/routing';
import { IRowAction } from '@/components/common/table/interface.d';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { Table } from '@/components/common/table/table';
import { appendHistory } from '../../store/settings';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export const FormInspectSettingPage: FunctionComponent = () => {
  const responses = useSignal<IResponseResponse[]>([]);
  const { t } = useTranslation();
  const [_, navigate] = useLocation();

  useEffect(() => {
    getResponseHandler();
  }, []);

  const getResponseHandler = async () => {
    const response = await FormService.get_response_all();
    if (!response.getStatus()) return;
    responses.value = response.getMany();
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

  const handleOnClick = async (action: IRowAction) => {
    const response = responses.value.find(
      (response) => response.id == action.id
    );
    if (!response?.structure) {
      if (!response?.structure) {
        toast.error(t('forms.error.notExistResponse'));
        return;
      }
    }
    switch (action.action) {
      case ROW_ACTIONS.RESPONSE: {
        setResponse(
          { mode: RESPONSE_MODE_SERVICE.UPDATE, id: response.id },
          response.structure
        );
        navigateResponse();
        break;
      }
      case ROW_ACTIONS.DELETE: {
        const respons = await FormService.remove_response_one(response.id);
        if (!respons.getStatus()) return;
        getResponseHandler();
        break;
      }
      case ROW_ACTIONS.REPORT: {
        setResponse(
          { mode: RESPONSE_MODE_SERVICE.UPDATE, id: response.id, hold: true },
          response.structure
        );
        navigateResponse();
        break;
      }
      default: {
        throw Error('ERROR: Not exist option');
      }
    }
  };

  return (
    <section className='pt-5'>
      <Table<IResponseResponse>
        data={responses.value}
        columns={columns}
        pageSize={20}
        onClickAction={handleOnClick}
      />
    </section>
  );
};
