import { FunctionComponent } from 'preact';
import { columns } from './components/task.columns';
import { Table } from '@/components/common/table/table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { useEffect } from 'preact/hooks';
import { useSignal, Signal } from '@preact/signals';
import { ToastManager } from '@/utils/toast/toast-manager';
import { TaskService } from '@/services';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/store/slices';
import { useNavigation } from '@/utils/hooks/navigation';
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
  const tasks: Signal<ITask[]> = useSignal([]);
  const loading = useSignal<boolean>(false);
  const { go } = useNavigation();
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

  const update = (id: string) => {
    go({
      to: `/shifts/task/update/${id}`,
      label: 'update',
      id: 'shift:tasks:state:create',
      base: 'setting',
    });
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
