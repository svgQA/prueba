import { Button } from '@/components/common/button/button';
import { Section } from '@/components/common/section/section';
import { IRowAction } from '@/components/common/table/interface.d';
import { Table } from '@/components/common/table/table';
import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
// import { IFormResponse } from '@/types/form';
// import { FORMAT_MODE_SERVICE, setFormat } from '../../forms/create/store';
import { useLocation } from 'wouter';
import { Round } from './utils/rounds';
import { roundsData } from './utils/rounds.data';
import { columns } from './components/rounds.columns';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { ExpandableRounds } from '@/components/compose/table/expandable/rounds';

export const RoundsSettingPage: FunctionComponent = () => {
  const [_, navigate] = useLocation();

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

  return (
    <Section>
      <div className='flex flex-col gap-1 w-10/12'>
        <div className='flex flex-row'>
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
        expandable={(row: any) => <ExpandableRounds row={row} />}
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
