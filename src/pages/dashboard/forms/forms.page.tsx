import { FormService } from '@/services';
import { IResponseResponse } from '@/types/form';
import { useSignal } from '@preact/signals';
import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { Section } from '@/components/common/section/section';
import { CardData } from '@/components/compose/cards';
import { Table } from '@/components/common/table/table';
import { IRowAction } from '@/components/common/table/interface';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { columns } from './components/inspect.columns';

export const FormsPage: FunctionComponent = () => {
  const responses = useSignal<IResponseResponse[]>([]);
  // const [_, navigate] = useLocation();

  useEffect(() => {
    getResponseHandler();
  }, []);

  const getResponseHandler = async () => {
    const response = await FormService.get_response_all();
    if (!response.getStatus()) return;
    responses.value = response.getMany();
  };

  const navigateResponse = () => {
    // const menu = {
    //   to: PAGES_LIST_ROUTER.dashboard.setting.forms.response.to,
    //   label: 'response',
    //   id: 'form-response',
    // };
    // appendHistory(menu);
    // navigate(menu.to);
  };

  const handleOnClick = async (action: IRowAction) => {
    const response = responses.value.find(
      (response) => response.id == action.id
    );
    if (!response?.structure) throw Error('ERROR: Not exist response');
    switch (action.action) {
      case ROW_ACTIONS.RESPONSE: {
        // setResponse(
        //   { mode: RESPONSE_MODE_SERVICE.UPDATE, id: response.id },
        //   response.structure
        // );
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
        // setResponse(
        //   { mode: RESPONSE_MODE_SERVICE.UPDATE, id: response.id, hold: true },
        //   response.structure
        // );
        navigateResponse();
        break;
      }
      default: {
        throw Error('ERROR: Not exist option');
      }
    }
  };

  return (
    <Section padding>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        <CardData
          title='Total Formularios'
          count={150}
          subtitle='Formularios creados'
          color='t-dark'
          icon='123'
        />

        <CardData
          title='Formularios Activos'
          count={100}
          subtitle='En uso'
          color='t-dark'
          icon='089'
        />

        <CardData
          title='Formularios Archivados'
          count={50}
          subtitle='No disponibles'
          color='t-dark'
          icon='098'
        />
      </div>
      <Table<IResponseResponse>
        data={responses.value}
        columns={columns}
        pageSize={20}
        onClickAction={handleOnClick}
      />
    </Section>
  );
};
