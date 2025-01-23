import { Button } from '@/components/common/button/button';
import { Section } from '@/components/common/section/section';
import { FunctionComponent } from 'preact';
import { useLocation } from 'wouter';
import { Place } from './utils/places';
import { columns } from './components/places.columns';
import { Table } from '@/components/common/table/table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { IRowAction } from '@/components/common/table/interface';
import { useEffect, useState } from 'preact/hooks';
import { ShiftService } from '@/services/shift';

export const PlacesSettingPage: FunctionComponent = () => {
  const [_, navigate] = useLocation();
  const [places, setPlaces] = useState([]);

  useEffect(() => {
   getPlaces();
  }, [])

  const getPlaces = async () => {
    const request: any = await ShiftService.getPlaces();
    setPlaces(request.data);
  }

  const redirect = () => {
    navigate('/rounds/places/create');
  };

  const handleOnClick = (action: IRowAction) => {
    switch (action.action) {
      case ROW_ACTIONS.UPDATE:
        redirect();
        break;
      default:
        break;
    }
  };

  return (
    <Section>
      <div className='flex flex-col gap-1 w-10/12'>
        <div className='flex flex-row'>
          <Button
            onClick={() => navigate('/rounds/places/create')}
            type='button'
            icon='039'
            name='back'
            rounded={true}
            className='w-auto'
          />
        </div>
      </div>
      <Table<Place>
        data={places}
        columns={columns}
        pageSize={20}
        visibility={{
          address: false,
          city: false,
          employeeId: false,
          duration: false,
        }}
        onClickAction={handleOnClick}
        unsearch={false}
      />
    </Section>
  );
};
