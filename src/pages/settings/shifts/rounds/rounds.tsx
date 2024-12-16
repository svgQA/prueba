import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

import { Section, Table } from '@/components/common';
import { type Rounds, roundsData } from './utils';
import { columns } from './components';
// import { useSignal } from '@preact/signals';
// import { IReportResponse } from '@/types/form';
// import { FormService } from '@/services';

export const RoundsSettingPage: FunctionComponent = () => {
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
      />
    </Section>
  );
};
