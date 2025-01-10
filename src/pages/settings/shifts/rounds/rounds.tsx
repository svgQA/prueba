import { Button } from '@/components/common/button/button';
import { Section } from '@/components/common/section/section';
import { IRowAction } from '@/components/common/table/interface.d';
import { Table } from '@/components/common/table/table';
import { type FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
// import { IFormResponse } from '@/types/form';
// import { FORMAT_MODE_SERVICE, setFormat } from '../../forms/create/store';
import { useLocation } from 'wouter';
import { Round } from './utils/rounds';
import { roundsData } from './utils/rounds.data';
import { columns } from './components/rounds.columns';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { Input } from '@/components/common/input/input';

export const RoundsSettingPage: FunctionComponent = () => {
  const [_, navigate] = useLocation();
  const [search, setSearch] = useState('');

  const redirect = () => {
    // setFormat(
    //   { mode: FORMAT_MODE_SERVICE.UPDATE, id: format.id },
    //   format.structure
    // );
    navigate('/round/create');
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

  useEffect(() => {
    document.title = 'Rounds Settings';
  }, []);

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
            onClick={() => navigate('/round/create')}
            type='button'
            icon='039'
            name='back'
            rounded={true}
            className='w-auto'
          />
        </div>
      </div>
      <Table<Round>
        data={roundsData}
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
