import { Button } from '@/components/common/button/button';
import { Section } from '@/components/common/section/section';
import { FunctionComponent } from 'preact';
import { useLocation } from 'wouter';
import { columns } from './components/activity.columns';
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

export interface IActivity {
  id: number;
  start: number;
  end: number;
  roundId: number;
  projectId: number;
  status: string;
  type: string;
}

export interface IRowActionPlace {
  id: string;
  type: string;
  action: ROW_ACTIONS;
}

export const ActivitySettingPage: FunctionComponent = () => {
  const [_, navigate] = useLocation();
  const activity: Signal<IActivity[]> = useSignal([]);

  useEffect(() => {
    document.title = 'VX - Activity Service';
    getActivities();
  }, []);

  const getActivities = async () => {
    const request: any = await ShiftService.getActivities();
    activity.value = request.data;
  };

  const redirect = () => {
    setMenu({ ...infoMenu.value, label: 'Creacion de turno' });
    navigate('/rounds/activity/create');
  };

  const updateActivity = (id: string) => {
    setMenu({ ...infoMenu.value, label: 'Editar turno' });
    navigate(`/rounds/activity/update/${id}`);
  };

  const deleteActivity = async (id: string) => {
    const request = await ShiftService.deleteActivity(id);
    if (!request.getStatus()) return;
    toast.success('Turno eliminado', { position: 'top-right' });
    getActivities();
  };

  const handleOnClick = async (action: IRowActionPlace | any) => {
    switch (action.action) {
      case ROW_ACTIONS.UPDATE:
        updateActivity(action.id);
        break;
      case ROW_ACTIONS.DELETE:
        await deleteActivity(action.id);
        break;
    }
  };

  return (
    <Section className='pt-2'>
      <div className='p-4 dark:bg-black bg-white rounde shado border-t-4 border-cyan-500  '>
        <Button
          onClick={redirect}
          type='button'
          icon='039'
          name='back'
          rounded={true}
          className='w-auto'
        />
        <Table<IActivity>
          data={activity.value}
          columns={columns}
          pageSize={20}
          visibility={{
            start: true,
            end: true,
            roundId: true,
            projectId: true,
            status: true,
            type: true,
          }}
          onClickAction={handleOnClick}
          unsearch={false}
        />
      </div>
    </Section>
  );
};
