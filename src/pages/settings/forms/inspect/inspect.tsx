import { Table } from '@/components/common';
import { IResponseResponse } from '@/types/form';
import { useSignal } from '@preact/signals';
import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
// import { useLocation } from 'wouter';
import { columns } from './components/response.columns';
import { IRowAction } from '@/components/common/interface';
import { FormService } from '@/services';

export const FormInspectSettingPage: FunctionComponent = () => {
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

  const handleOnClick = (action: IRowAction) => {
    console.log('ACTION: ', action);
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
