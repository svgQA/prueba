import './index.css';
import { Table } from '@/components/common';
import { useLocation } from 'wouter';
import { columns } from './components';
import { useEffect } from 'preact/hooks';
import { FormService } from '@/services';
import { useSignal } from '@preact/signals';
import { IFormResponse } from '@/types/form';
import { IRowAction } from '@/components/common/interface';
import { FORMAT_MODE_SERVICE, setFormat } from '../create/store';
import { CardMenu } from './components/card.menu';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

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

  const handleOnClick = (action: IRowAction) => {
    const format = forms.value.find((format) => format.id == action.id);
    if (!format?.structure) throw Error('ERROR: Not exist format in this form');
    try {
      setFormat(
        {
          mode: FORMAT_MODE_SERVICE.UPDATE,
          id: format.id,
        },
        format.structure
      );
      navigate('/form/create');
    } catch {
      throw Error('ERROR: Not allowed convert form-struct.');
    }
  };

  return (
    <section className='pt-5 px-5'>
      <div class='flex flex-row gap-2 justify-center mb-5'>
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
        <CardMenu
          menu={{
            to: PAGES_LIST_ROUTER.dashboard.setting.forms.report.to,
            label: 'create',
            id: 'form-create',
          }}
          title='Crete Report Design'
          description='Create Report to format'
          icon='023'
        />
      </div>
      <Table<IFormResponse>
        data={forms.value}
        columns={columns}
        pageSize={20}
        onClickAction={handleOnClick}
      />
    </section>
  );
};
