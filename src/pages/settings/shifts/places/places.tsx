import { Button } from '@/components/common/button/button';
import { Section } from '@/components/common/section/section';
import { FunctionComponent } from 'preact';
import { useLocation } from 'wouter';
import { placesData } from './utils/places.data';
import { Place } from './utils/places';
import { columns } from './components/places.columns';
import { Table } from '@/components/common/table/table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { IRowAction } from '@/components/common/table/interface';
import { Input } from '@/components/common/input/input';
import { useState } from 'preact/hooks';

export const PlacesSettingPage: FunctionComponent = () => {
  const [_, navigate] = useLocation();
  const [search, setSearch] = useState('');

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

  const handleFormatInputChange = (e: any) => {
    const { value } = e.target;
    setSearch(value);
  };

  return (
    <Section>
      <div className='flex flex-col gap-1 w-10/12'>
        <div className='flex flex-row'>
          <Input
            type='text'
            placeholder='Buscar'
            name='search'
            value={search}
            onChange={handleFormatInputChange}
          />
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
        data={placesData}
        columns={columns}
        pageSize={20}
        visibility={{
          address: false,
          city: false,
          employeeId: false,
          duration: false,
        }}
        onClickAction={handleOnClick}
        unsearch
      />
    </Section>
  );
};
