import './index.css';
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

  const redirect = (format: IFormResponse) => {
    setFormat(
      { mode: FORMAT_MODE_SERVICE.UPDATE, id: format.id },
      format.structure
    );
    navigate('/form/create');
  };

  const handleOnClick = (action: IRowAction) => {
    const format = forms.value.find((format) => format.id == action.id);
    if (!format?.structure) throw Error('ERROR: Not exist format in this form');
    switch (action.action) {
      case ROW_ACTIONS.UPDATE:
        redirect(format);
        break;
      case ROW_ACTIONS.DELETE:
        console.log('ELIMINAR ESTA VUELTA');
        break;
      case ROW_ACTIONS.REPORT:
        navigate('/form/report');
        break;
      default:
        break;
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
        {/*
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
        */}
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
