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

  const handleOnClick = async (action: IRowActionPlace | any) => {
    console.log(action);
    switch (action.action) {
      case ROW_ACTIONS.UPDATE:
        console.log('UPDATE');
        break;
      case ROW_ACTIONS.DELETE:
        await deletePlace(action.id);
        console.log('DELETE');
        break;
    }
  };

  return (
    <Section className='pt-2'>
      <div className='p-4 dark:bg-black bg-white rounded-lg shadow-xl  border-t-4 border-cyan-500  '>
        <Button
          onClick={redirect}
          type='button'
          icon='039'
          name='back'
          rounded={true}
          className='w-auto'
        />
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
      </div>
    </Section>
  );
};
