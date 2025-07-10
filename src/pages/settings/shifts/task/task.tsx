// import { Button } from '@/components/common/button/button';
// import { Section } from '@/components/common/section/section';
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
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/store/slices';

export interface ITask {
  id: number;
  status: string;
  description: string;
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

  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('p_task');
  }, []);

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    // TODO: Para cargar cuando se haya seleccionado una empresa, sino falla por tenant
    if (selectedCompany) {
      getTasks();
    }
  }, [selectedCompany, location]);

  const getTasks = async () => {
    loading.value = true;
    const request: any = await TaskService.getTasks();
    if (request.getStatus()) {
      tasks.value = request.getMany();
    }
    loading.value = false;
  };

  // const redirect = () => {
  //   const menu = {
  //     to: PAGES_LIST_ROUTER.dashboard.setting.shifts.task.create.to,
  //     label: 'create',
  //     id: 'tasks-create',
  //   };
  //   appendHistory(menu);
  //   // OJO: No traducir, dejar asi los setMenu
  //   setMenu({ ...infoMenu.value, label: 'create' });
  //   navigate('/rounds/task/create');
  // };

  const update = (id: string) => {
    const menu = {
      to: PAGES_LIST_ROUTER.dashboard.setting.shifts.task.update.to,
      label: 'update',
      id: 'tasks-update',
    };
    appendHistory(menu);
    // OJO: No traducir, dejar asi los setMenu
    setMenu({ ...infoMenu.value, label: 'edit' });
    navigate(`/rounds/task/update/${id}`);
  };

  const deleteTask = async (id: string) => {
    const request = await TaskService.deleteTask(id);
    if (!request.getStatus()) return;
    ToastManager.success('s_deleted_success');
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
    <>
      <Table<ITask>
        data={tasks.value}
        columns={columns}
        visibility={{
          id: false,
        }}
        absolute
        onClickAction={handleOnClick}
        isSettingTable
        loading={loading.value}
      />
    </>
  );
};
