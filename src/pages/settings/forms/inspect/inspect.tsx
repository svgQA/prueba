import { Table } from '@/components/common';
import { IResponseResponse } from '@/types/form';
import { useSignal } from '@preact/signals';
import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { useLocation } from 'wouter';
import { columns } from './components/inspect.columns';
import { IRowAction, ROW_ACTIONS } from '@/components/common/interface';
import { FormService } from '@/services';
import { RESPONSE_MODE_SERVICE, setResponse } from '../response/store/response';
import { PAGES_LIST_ROUTER } from '@/utils/routing';
import { appendHistory } from '../../store';

export const FormInspectSettingPage: FunctionComponent = () => {
  const responses = useSignal<IResponseResponse[]>([]);
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

  const handleOnClick = (action: IRowAction) => {
    const response = responses.value.find(
      (response) => response.id == action.id
    );
    if (!response?.structure) throw Error('ERROR: Not exist response');
    switch (action.action) {
      case ROW_ACTIONS.RESPONSE: {
        setResponse({ mode: RESPONSE_MODE_SERVICE.UPDATE }, response.structure);
        navigateResponse();
        break;
      }
      case ROW_ACTIONS.DELETE: {
        break;
      }
      case ROW_ACTIONS.REPORT: {
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
        unsearch
      />
    </section>
  );
};
