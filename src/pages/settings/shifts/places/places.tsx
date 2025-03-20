import { Button } from '@/components/common/button/button';
import { Section } from '@/components/common/section/section';
import { FunctionComponent } from 'preact';
import { useLocation } from 'wouter';
import { Place } from './utils/places';
import { columns } from './components/places.columns';
import { Table } from '@/components/common/table/table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { useEffect, useState } from 'preact/hooks';
import { ShiftService } from '@/services/shift';
import { toast } from 'react-toastify';

import {
  menuInformationSelected as infoMenu,
  setMenu,
} from '../../store/settings';

export interface IRowActionPlace {
  id: string;
  type: string;
  action: ROW_ACTIONS;
}

export const PlacesSettingPage: FunctionComponent = () => {
  const [_, navigate] = useLocation();
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    document.title = 'VX - Place Service';
    getPlaces();
  }, []);

  const getPlaces = async () => {
    const request: any = await ShiftService.getPlaces();
    setPlaces(request.data);
  };

  const redirect = () => {
    setMenu({ ...infoMenu.value, label: 'Creacion de lugar' });
    navigate('/rounds/places/create');
  };

  const deletePlace = async (id: string) => {
    const request = await ShiftService.deletePlace(id);
    if (!request.getStatus()) return;
    toast.success('Lugar eliminado', { position: 'top-right' });
    getPlaces();
  };

  const update = (id: string) => {
    setMenu({ ...infoMenu.value, label: 'Editar lugar' });
    navigate(`/rounds/places/update/${id}`);
  };
  const handleOnClick = async (action: IRowActionPlace | any) => {
    console.log(action);
    switch (action.action) {
      case ROW_ACTIONS.UPDATE:
        update(action.id);
        break;
      case ROW_ACTIONS.DELETE:
        await deletePlace(action.id);
        break;
    }
  };

  return (
    <Section className='pt-2'>
      <div className='py-2 flex flex-row justify-between items-center overflow-visible xl:absolute relative z-20'>
        <div className='flex flex-row items-center justify-between'>
          <Button
            name='button-create-shift'
            label='Nueva Actividad'
            icon='039'
            onClick={redirect}
            className='px-6 py-2 text-sm font-medium rounded md:text-base h-fit items-center justify-center inline-flex bg-primary text-white border-none'
          />
        </div>
      </div>
      <Table<Place>
        data={places}
        columns={columns}
        pageSize={20}
        visibility={{
          address: true,
          name: true,
          description: true,
          action: true,
        }}
        onClickAction={handleOnClick}
        unsearch={false}
      />
    </Section>
  );
};
