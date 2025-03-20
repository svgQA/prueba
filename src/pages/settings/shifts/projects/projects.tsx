import { Button } from '@/components/common/button/button';
import { Section } from '@/components/common/section/section';
import { FunctionComponent } from 'preact';
import { useLocation } from 'wouter';
import { columns } from './components/places.columns';
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
    const request: any = await ShiftService.getProjects();
    projects.value = request.data;
  };

  const redirect = () => {
    setMenu({ ...infoMenu.value, label: 'Creacion de contrato' });
    navigate('/rounds/project/create');
  };

  const editProject = (id: string) => {
    setMenu({ ...infoMenu.value, label: 'Editar contrato' });
    navigate(`/rounds/project/edit/${id}`);
  };

  const deleteProject = async (id: string) => {
    const request = await ShiftService.deleteProject(id);
    if (!request.getStatus()) return;
    toast.success('Lugar contrato', { position: 'top-right' });
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
        pageSize={20}
        visibility={{
          id: false,
          description: false,
        }}
        onClickAction={handleOnClick}
        unsearch={false}
      />
    </Section>
  );
};
