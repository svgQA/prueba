import { type FunctionComponent } from 'preact';
import { useEffect, useMemo, useState } from 'preact/hooks';
import { defaultData, Person } from './person';
import { ColumnDef } from '@tanstack/react-table';
import { Search, Table } from '@/components/common';

export const MemosPage: FunctionComponent = () => {
  const [data, _setData] = useState(() => [...defaultData]);
  useEffect(() => {
    document.title = 'VX - Memos Service';
  }, []);

  const columns = useMemo<ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'firstName',
        header: 'First Name',
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row.lastName,
        id: 'lastName',
        header: 'Last Name',
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        accessorKey: 'age',
        header: 'Age',
        footer: (props) => props.column.id,
      },
      {
        accessorKey: 'visits',
        header: 'Visits',
        footer: (props) => props.column.id,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        footer: (props) => props.column.id,
      },
      {
        accessorKey: 'progress',
        header: 'Profile Progress',
        footer: (props) => props.column.id,
      },
    ],
    []
  );

  return (
    <section>
      <Table
        search={<Search name='search-memos' />}
        {...{
          data,
          columns,
        }}
      />
    </section>
  );
};
