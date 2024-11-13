import './index.css';
import { Table } from '@/components/common';
import { Link } from 'wouter';
import { IForm } from './utils/form';
import { formData } from './utils/form.data';
import { columns } from './components';
export const FormSettingPage = () => {
  return (
    <section>
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
      <Table<IForm> data={formData} columns={columns} pageSize={20} />
    </section>
  );
};
