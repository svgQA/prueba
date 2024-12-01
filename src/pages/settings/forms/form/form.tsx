import './index.css';
import { Table } from '@/components/common';
import { Link } from 'wouter';
import { columns } from './components';
import { useEffect } from 'preact/hooks';
import { FormService } from '@/services';
import { useSignal } from '@preact/signals';
import { IFormResponse } from '@/types/form';
import { IRowAction } from '@/components/common/interface';

export const FormSettingPage = () => {
  const forms = useSignal<IFormResponse[]>([]);

  useEffect(() => {
    getFormsHandler();
  }, []);

  const getFormsHandler = async () => {
    const response = await FormService.get_all();
    if (!response.getStatus()) return;
    forms.value = response.getMany();
  };

  const handleOnClick = (action: IRowAction) => {
    console.table(action);
  };

  return (
    <section className='pt-5 px-5'>
      <div class='flex flex-row gap-2 justify-center mb-5'>
        <Link to='/form/create' className='form-button-general'>
          <span className='vx-icon vx-icon-055 size-xl text-primary' />
          <h4>Start from scratch</h4>
          <p>Get started with a blank template.</p>
        </Link>
        <Link to='/form/report' className='form-button-general'>
          <span className='vx-icon vx-icon-097 size-xl text-primary' />
          <h4>Crete Report Design</h4>
          <p>Create Report to format</p>
        </Link>
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
