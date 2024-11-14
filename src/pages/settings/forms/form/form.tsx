import './index.css';
import { Table } from '@/components/common';
import { Link } from 'wouter';
import { IForm } from './utils/form';
import { columns } from './components';
import { useEffect } from 'preact/hooks';
import { FormService } from '@/services';
import { useSignal } from '@preact/signals';

export const FormSettingPage = () => {
  const forms = useSignal<IForm[]>([]);

  useEffect(() => {
    getFormsHandler();
  }, []);

  const getFormsHandler = async () => {
    const response = await FormService.get_all();
    if (!response.getStatus()) return;
    forms.value = response.getMany();
  };

  return (
    <section className='pt-5'>
      <div class='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6'>
        <Link to='/form/create' className='form-button-general'>
          <span className='vx-icon vx-icon-055 size-xl text-primary' />
          <h4>Start from scratch</h4>
          <p>Get started with a blank template.</p>
        </Link>
        <Link to='/form/list' className='form-button-general'>
          <span className='vx-icon vx-icon-093 size-xl text-primary' />
          <h4>Create a List</h4>
          <p>Get started with a blank list.</p>
        </Link>
        <Link to='/form/report' className='form-button-general'>
          <span className='vx-icon vx-icon-097 size-xl text-primary' />
          <h4>Crete Report Design</h4>
          <p>Create Report to format</p>
        </Link>
      </div>
      <Table<IForm> data={forms.value} columns={columns} pageSize={20} />
    </section>
  );
};
