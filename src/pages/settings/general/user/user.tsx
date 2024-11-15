import { type FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Section, Table } from '@/components/common';

import { type User, userData } from './utils';
import { columns } from './components';
import { ExpandableUser } from '@/components/compose/table/expandable/user';
import { CardData } from '@/components/compose';

export const UserSettingPage: FunctionComponent = () => {
  const [data, setData] = useState<User[]>([]);
  useEffect(() => {
    document.title = 'User Settings';
    setData(userData);
  }, []);
  return (
    <Section>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        <CardData
          title='Conectados'
          count={1000}
          subtitle='Usuarios Conectados'
          color='text-secondary'
          icon='190'
        />

        <CardData
          title='Inactivos'
          count={300}
          subtitle='Usuarios Inactivos'
          color='text-primary'
          icon='191'
        />

        <CardData
          title='Nunca'
          count={200}
          subtitle='Usuarios Nunca Conectados'
          color='text-error'
          icon='192'
        />
      </div>
      <Table<User>
        data={data}
        columns={columns}
        pageSize={16}
        expandable={(row: User) => <ExpandableUser row={row} />}
      />
    </Section>
  );
};
