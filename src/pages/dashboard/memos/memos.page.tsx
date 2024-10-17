import { type FunctionComponent } from 'preact';
import { useEffect, useMemo } from 'preact/hooks';
import { defaultData, Person } from './person';
import { ColumnDef } from '@tanstack/react-table';
import { Table } from '@/components/common/table/table';
import { Search } from '@/components/common';

export const MemosPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'VX - Memos Service';
  }, []);

  const columns = useMemo<ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'firstName',
        header: 'First Name',
        cell: (info) => info.getValue(),
      },
      {
        accessorFn: (row) => row.lastName,
        id: 'lastName',
        header: 'Last Name',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'age',
        header: 'Age',
      },
      {
        accessorKey: 'visits',
        header: 'Visitas',
      },
      {
        accessorKey: 'status',
        header: 'Status',
      },
      {
        accessorKey: 'progress',
        header: 'Profile Progress',
      },
    ],
    []
  );

  return (
    <section>
      <Table
        data={defaultData}
        columns={columns}
        searchPlaceholder='Buscar memos...'
        pageSize={20}
        search={
          <Search
            id='search-memos'
            name='search-memos'
            keys={['id_1', 'id_2', 'id_3', 'id_4']}
          />
        }
      />
    </section>
  );
};
