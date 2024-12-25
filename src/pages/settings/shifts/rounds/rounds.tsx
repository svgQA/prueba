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
      <Button
        onClick={() => navigate('/round/create')}
        type='button'
        label='Crear'
        icon='123'
        name='back'
      />
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
