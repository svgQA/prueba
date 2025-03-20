import { Button } from '@/components/common/button/button';
import { Section } from '@/components/common/section/section';
import { FunctionComponent } from 'preact';
import { useLocation } from 'wouter';
import { columns } from './components/service.columns';
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

export interface IServicio {
  id: number;
  name: string;
  description: string;
  priority: string;
}

export interface IRowActionPlace {
  id: string;
  type: string;
  action: ROW_ACTIONS;
}

export const ServiceSettingPage: FunctionComponent = () => {
  const [_, navigate] = useLocation();
  const novelties: Signal<IServicio[]> = useSignal([]);

  useEffect(() => {
    document.title = 'VX - Servie Service';
    getServices();
  }, []);

  const getServices = async () => {
    const request: any = await ShiftService.getServices();
    novelties.value = request.data;
  };

  const redirect = () => {
    setMenu({ ...infoMenu.value, label: 'Creacion de servicio' });
    navigate('/rounds/service/create');
  };

  const update = (id: string) => {
    setMenu({ ...infoMenu.value, label: 'Editar servicio' });
    navigate(`/rounds/service/update/${id}`);
  };

  const deleteNovelty = async (id: string) => {
    const request = await ShiftService.deleteService(id);
    if (!request.getStatus()) return;
    toast.success('Servicio eliminado', { position: 'top-right' });
    getServices();
  };

  const handleOnClick = async (action: IRowActionPlace | any) => {
    switch (action.action) {
      case ROW_ACTIONS.UPDATE:
        update(action.id);
        break;
      case ROW_ACTIONS.DELETE:
        await deleteNovelty(action.id);
        break;
    }
  };

  return (
    <Section className='pt-2'>
      <div className='py-2 flex flex-row justify-between items-center overflow-visible xl:absolute relative z-20'>
        <div className='flex flex-row items-center justify-between'>
          <Button
            name='button-create-shift'
            label='Nuevo Servicio'
            icon='039'
            onClick={redirect}
            className='px-6 py-2 text-sm font-medium rounded md:text-base h-fit items-center justify-center inline-flex bg-primary text-white border-none'
          />
        </div>
      </div>
      <Table<IServicio>
        data={novelties.value}
        columns={columns}
        pageSize={20}
        visibility={{
          id: false,
        }}
        onClickAction={handleOnClick}
        unsearch={false}
      />
    </Section>
  );
};
