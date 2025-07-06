import { Button } from '@/components/common/button/button';
import { Section } from '@/components/common/section/section';
import { FunctionComponent } from 'preact';
import { useLocation } from 'wouter';
import { columns } from './components/project.columns';
import { Table } from '@/components/common/table/table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { useEffect } from 'preact/hooks';
import { useSignal, Signal } from '@preact/signals';
import { ToastManager } from '@/utils/toast/toast-manager';
import { appendHistory } from '../../store/settings';

import {
  menuInformationSelected as infoMenu,
  setMenu,
} from '../../store/settings';
import { ContractService } from '@/services';
import { PAGES_LIST_ROUTER } from '@/utils/routing';
import { useTranslation } from 'react-i18next';

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
  const [_, navigate] = useLocation();
  const projects: Signal<IProject[]> = useSignal([]);
  const loading = useSignal<boolean>(false);
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('p_project');
    getProjects();
  }, []);

  const getProjects = async () => {
    loading.value = true;
    const request: any = await ContractService.getProjects();
    if (request.getStatus()) {
      projects.value = request.getMany();
    }
    loading.value = false;
  };

  const redirect = () => {
    const menu = {
      to: PAGES_LIST_ROUTER.dashboard.setting.shifts.projectCreate.to,
      label: 'create',
      id: 'projects-create',
    };
    appendHistory(menu);
    // OJO: No traducir, dejar asi los setMenu
    setMenu({ ...infoMenu.value, label: 'create' });
    navigate('/rounds/project/create');
  };

  const editProject = (id: string) => {
    const menu = {
      to: PAGES_LIST_ROUTER.dashboard.setting.shifts.projectUpdate.to,
      label: 'update',
      id: 'projects-update',
    };
    appendHistory(menu);
    // OJO: No traducir, dejar asi los setMenu
    setMenu({ ...infoMenu.value, label: 'edit' });
    navigate(`/rounds/project/edit/${id}`);
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
      />
    </Section>
  );
};
