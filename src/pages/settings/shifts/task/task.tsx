import { Button } from '@/components/common/button/button';
import { Section } from '@/components/common/section/section';
import { FunctionComponent } from 'preact';
import { useLocation } from 'wouter';
import { columns } from './components/task.columns';
import { Table } from '@/components/common/table/table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { useEffect } from 'preact/hooks';
import { useSignal, Signal } from '@preact/signals';

import { ShiftService } from '@/services/shift';
import { toast } from 'react-toastify';

import {
  menuInformationSelected as infoMenu,
  setMenu,
} from '../../store/settings';

export interface ITask {
  id: number;
  description: string;
  status: string;
  formId: number;
  start: string;
}

export interface IRowActionPlace {
  id: string;
  type: string;
  action: ROW_ACTIONS;
}

export const TaskSettingPage: FunctionComponent = () => {
  const [_, navigate] = useLocation();
  const tasks: Signal<ITask[]> = useSignal([]);

  useEffect(() => {
    document.title = 'VX - Task Service';
    getTasks();
  }, []);

  const getTasks = async () => {
    const request: any = await ShiftService.getTasks();
    tasks.value = request.data;
  };

  const redirect = () => {
    setMenu({ ...infoMenu.value, label: 'Creacion de tarea' });
    navigate('/rounds/task/create');
  };

  const update = (id: string) => {
    setMenu({ ...infoMenu.value, label: 'Editar tarea' });
    navigate(`/rounds/task/update/${id}`);
  };

  const deleteTask = async (id: string) => {
    const request = await ShiftService.deleteTask(id);
    if (!request.getStatus()) return;
    toast.success('Tarea eliminado', { position: 'top-right' });
    getTasks();
  };

  const handleOnClick = async (action: IRowActionPlace | any) => {
    switch (action.action) {
      case ROW_ACTIONS.UPDATE:
        update(action.id);
        break;
      case ROW_ACTIONS.DELETE:
        await deleteTask(action.id);
        break;
    }
  };

  return (
    <Section>
      <Button
        onClick={redirect}
        type='button'
        icon='039'
        name='back'
        rounded={true}
        className='w-auto'
      />
      <Table<ITask>
        data={tasks.value}
        columns={columns}
        pageSize={20}
        visibility={{
          description: true,
          status: true,
          action: true,
        }}
        onClickAction={handleOnClick}
        unsearch={false}
      />
    </Section>
  );
};
