// import { Button } from '@/components/common/button/button';
// import { Section } from '@/components/common/section/section';
import { FunctionComponent } from 'preact';
import { columns } from './components/project.columns';
import { Table } from '@/components/common/table/table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { useEffect } from 'preact/hooks';
import { useSignal, Signal } from '@preact/signals';
import { ToastManager } from '@/utils/toast/toast-manager';
import { ContractService } from '@/services';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@/utils/hooks/navigation';
import { useUserStore } from '@/store/slices';

export interface IProject {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  state: string;
  priority: string;
}

export interface IRowActionPlace {
  id: string;
  type: string;
  action: ROW_ACTIONS;
}

export const ProjectsSettingPage: FunctionComponent = () => {
  const { go } = useNavigation();
  const projects: Signal<IProject[]> = useSignal([]);
  const loading = useSignal<boolean>(false);
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('p_project');
  }, []);

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    // TODO: Para cargar cuando se haya seleccionado una empresa, sino falla por tenant
    if (selectedCompany) {
      getProjects();
    }
  }, [selectedCompany, location]);

  const getProjects = async () => {
    loading.value = true;
    const request: any = await ContractService.getProjects();
    if (request.getStatus()) {
      projects.value = request.getMany();
    }
    loading.value = false;
  };

  const editProject = (id: string) => {
    go({
      to: `/shifts/project/edit/${id}`,
      label: 'edit',
      id: 'shifts:project:state:update',
      base: 'setting',
    });
  };

  const deleteProject = async (id: string) => {
    const request = await ContractService.deleteProject(id);
    if (!request.getStatus()) return;
    ToastManager.success('s_deleted_success');
    getProjects();
  };

  const handleOnClick = async (action: IRowActionPlace | any) => {
    switch (action.action) {
      case ROW_ACTIONS.UPDATE:
        editProject(action.id);
        break;
      case ROW_ACTIONS.DELETE:
        await deleteProject(action.id);
        break;
    }
  };

  return (
    <>
      <Table<IProject>
        data={projects.value}
        columns={columns}
        pageSize={20}
        visibility={{
          id: false,
        }}
        onClickAction={handleOnClick}
        isSettingTable
        loading={loading.value}
        absolute
      />
    </>
  );
};
