import { Button } from '@/components/common/button/button';
import { Section } from '@/components/common/section/section';
import { FunctionComponent } from 'preact';
import { useLocation } from 'wouter';
import { columns } from './components/places.columns';
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

  useEffect(() => {
    document.title = 'VX - Project Service';
    getProjects();
  }, []);

  const getProjects = async () => {
    const request: any = await ContractService.getProjects();
    projects.value = request.data;
  };

  const redirect = () => {
    const menu = {
      to: PAGES_LIST_ROUTER.dashboard.setting.shifts.projectCreate.to,
      label: 'create',
      id: 'projects-create',
    };
    appendHistory(menu);
    setMenu({ ...infoMenu.value, label: 'Creacion de contrato' });
    navigate('/rounds/project/create');
  };

  const editProject = (id: string) => {
    const menu = {
      to: PAGES_LIST_ROUTER.dashboard.setting.shifts.projectUpdate.to,
      label: 'update',
      id: 'projects-update',
    };
    appendHistory(menu);
    setMenu({ ...infoMenu.value, label: 'Editar contrato' });
    navigate(`/rounds/project/edit/${id}`);
  };

  const deleteProject = async (id: string) => {
    const request = await ContractService.deleteProject(id);
    if (!request.getStatus()) return;
    ToastManager.success('Lugar contrato');
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
            label='Nuevo contrato'
            icon='039'
            onClick={redirect}
            className='px-6 py-2 text-sm font-medium rounded md:text-base h-fit items-center justify-center inline-flex bg-primary text-white border-none'
          />
        </div>
      </div>
      <Table<IProject>
        data={projects.value}
        columns={columns}
        visibility={{
          id: false,
          description: false,
        }}
        onClickAction={handleOnClick}
        unsearch={false}
        isSettingTable
      />
    </Section>
  );
};
