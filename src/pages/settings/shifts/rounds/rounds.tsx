import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { Section, Table } from '@/components/common';
import { type Rounds, roundsData } from './utils';
import { columns } from './components';
import { IRowAction, ROW_ACTIONS } from '@/components/common/interface';
// import { IFormResponse } from '@/types/form';
// import { FORMAT_MODE_SERVICE, setFormat } from '../../forms/create/store';
// import { useLocation } from 'wouter';

export const RoundsSettingPage: FunctionComponent = () => {
  // const [_, navigate] = useLocation();

  // const redirect = (format: IFormResponse) => {
  //   setFormat(
  //     { mode: FORMAT_MODE_SERVICE.UPDATE, id: format.id },
  //     format.structure
  //   );
  //   navigate('/form/create');
  // };

  const handleOnClick = (action: IRowAction) => {
    switch (action.action) {
      case ROW_ACTIONS.UPDATE:
        // redirect(format);
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
      <Table<Rounds>
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
      />
    </Section>
  );
};
