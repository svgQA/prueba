import { Button } from '@/components/common/button/button';
import { Section } from '@/components/common/section/section';
import { FunctionComponent } from 'preact';
import { useLocation } from 'wouter';
import { columns } from './components/schedule.columns';
import { Table } from '@/components/common/table/table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { useEffect } from 'preact/hooks';
import { useSignal, Signal } from '@preact/signals';
import data from './fakeJson.json';
import { ShiftService } from '@/services/shift';
import { toast } from 'react-toastify';

import {
  menuInformationSelected as infoMenu,
  setMenu,
} from '../../store/settings';

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
    const request: any = await ShiftService.getSchedules();
    console.log(request);
    schedules.value = data;
  };

  const redirect = () => {
    setMenu({ ...infoMenu.value, label: 'Creacion de horarios' });
    navigate('/rounds/schedule/create');
  };

  const update = (id: string) => {
    setMenu({ ...infoMenu.value, label: 'Editar horarios' });
    navigate(`/rounds/schedule/update/${id}`);
  };

  const deleteSchedule = async (id: string) => {
    const request = await ShiftService.deleteSchedule(id);
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
            <div className='grid grid-cols-1 gap-3'>
              {row.days.map((dayInfo: any, index: any) => (
                <div
                  class='col-span-1'
                  key={index}
                  style={{
                    border: '1px solid #ccc',
                    padding: '10px',
                    minWidth: '120px',
                  }}
                >
                  <h4>{dayInfo.day}</h4>
                  <ul>
                    {dayInfo.hour.map((time: any, i: any) => (
                      <li key={i}>{time}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          );
        }}
        pageSize={20}
        visibility={{
          name: true,
          description: true,
          priority: true,
          action: true,
        }}
        onClickAction={handleOnClick}
        unsearch={false}
      />
    </Section>
  );
};
