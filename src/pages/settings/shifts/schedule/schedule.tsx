import { Button } from '@/components/common/button/button';
import { Section } from '@/components/common/section/section';
import { FunctionComponent } from 'preact';
import { useLocation } from 'wouter';
import { columns } from './components/schedule.columns';
import { Table } from '@/components/common/table/table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { useEffect } from 'preact/hooks';
import { useSignal, Signal } from '@preact/signals';
import { toast } from 'react-toastify';

import {
  menuInformationSelected as infoMenu,
  setMenu,
} from '../../store/settings';
import { DataSchedule, DaySelection } from './components/data.schedule';
import { ScheduleService } from '@/services';

export interface ISchedule {
  id: number;
  name: string;
  daysAllowed: string[];
  days: any;
}

export interface IRowActionPlace {
  id: string;
  type: string;
  action: ROW_ACTIONS;
}

export const ScheduleSettingPage: FunctionComponent = () => {
  const [_, navigate] = useLocation();
  const schedules: Signal<ISchedule[]> = useSignal([]);

  useEffect(() => {
    document.title = 'VX - Schedule Service';
    getSchedules();
  }, []);

  const getSchedules = async () => {
    const request: any = await ScheduleService.getSchedules();
    if (!request.getStatus()) return;
    schedules.value = request.getMany();
  };

  const redirect = () => {
    setMenu({ ...infoMenu.value, label: 'Creación de horarios' });
    navigate('/rounds/schedule/create');
  };

  const update = (id: string) => {
    setMenu({ ...infoMenu.value, label: 'Editar horarios' });
    navigate(`/rounds/schedule/update/${id}`);
  };

  const deleteSchedule = async (id: string) => {
    const request = await ScheduleService.deleteSchedule(id);
    if (!request.getStatus()) return;
    toast.success('horario eliminado', { position: 'top-right' });
    getSchedules();
  };

  const handleOnClick = async (action: IRowActionPlace | any) => {
    switch (action.action) {
      case ROW_ACTIONS.UPDATE:
        update(action.id);
        break;
      case ROW_ACTIONS.DELETE:
        await deleteSchedule(action.id);
        break;
    }
  };

  return (
    <Section className='pt-2'>
      <div className='py-2 flex flex-row justify-between items-center overflow-visible xl:absolute relative z-20'>
        <div className='flex flex-row items-center justify-between'>
          <Button
            name='button-create-shift'
            label='Nueva Horario'
            icon='039'
            onClick={redirect}
            className='px-6 py-2 text-sm font-medium rounded md:text-base h-fit items-center justify-center inline-flex bg-primary text-white border-none'
          />
        </div>
      </div>
      <Table<ISchedule>
        data={schedules.value}
        columns={columns}
        expandable={(row: any) => {
          return (
            <ul className='flex flex-wrap justify-center gap-x-2'>
              {row.days.map((dayInfo: DaySelection) => (
                <DataSchedule daySelection={dayInfo} />
              ))}
            </ul>
          );
        }}
        visibility={{
          id: false,
          name: true,
          daysAllowed: true,
        }}
        onClickAction={handleOnClick}
        unsearch={false}
      />
    </Section>
  );
};
