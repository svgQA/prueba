import { Button } from '@/components/common/button/button';
import { Section } from '@/components/common/section/section';
import { FunctionComponent } from 'preact';
import { useLocation } from 'wouter';
import { columns } from './components/task.columns';
import { Table } from '@/components/common/table/table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { useEffect } from 'preact/hooks';
import { useSignal, Signal } from '@preact/signals';
import { PAGES_LIST_ROUTER } from '@/utils/routing';
import { appendHistory } from '../../store/settings';
import { ToastManager } from '@/utils/toast/toast-manager';

import {
  menuInformationSelected as infoMenu,
  setMenu,
} from '../../store/settings';
import { TaskService } from '@/services';

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
  const loading = useSignal<boolean>(false);

  useEffect(() => {
    document.title = 'VX - Task Service';
    getTasks();
  }, []);

  const getTasks = async () => {
    loading.value = true;
    const request: any = await TaskService.getTasks();
    if (request.getStatus()) {
      tasks.value = request.getMany();
    }
    loading.value = false;
  };

  const redirect = () => {
    const menu = {
      to: PAGES_LIST_ROUTER.dashboard.setting.shifts.task.create.to,
      label: 'create',
      id: 'tasks-create',
    };
    appendHistory(menu);
    setMenu({ ...infoMenu.value, label: 'Creacion de tarea' });
    navigate('/rounds/task/create');
  };

  const update = (id: string) => {
    const menu = {
      to: PAGES_LIST_ROUTER.dashboard.setting.shifts.task.update.to,
      label: 'update',
      id: 'tasks-update',
    };
    appendHistory(menu);
    setMenu({ ...infoMenu.value, label: 'Editar tarea' });
    navigate(`/rounds/task/update/${id}`);
  };

  const deleteTask = async (id: string) => {
    const request = await TaskService.deleteTask(id);
    if (!request.getStatus()) return;
    ToastManager.success('Tarea eliminado');
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
    <Section className='pt-2'>
      <div className='py-2 flex flex-row justify-between items-center overflow-visible xl:absolute relative z-20'>
        <div className='flex flex-row items-center justify-between'>
          <Button
            name='button-create-shift'
            label='new'
            icon='039'
            onClick={redirect}
            className='px-6 py-2 text-sm font-medium rounded md:text-base h-fit items-center justify-center inline-flex bg-primary text-white border-none'
          />
        </div>
      </div>
      <Table<ITask>
        data={tasks.value}
        columns={columns}
        visibility={{
          id: false,
        }}
        onClickAction={handleOnClick}
        isSettingTable
        loading={loading.value}
      />
    </Section>
  );
};
