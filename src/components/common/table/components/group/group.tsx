import { Table } from '@tanstack/react-table';

interface IGroupProps<T> {
  table: Table<T>;
}

export const Group = <T,>({ table }: IGroupProps<T>) => {
  const groupableColumns = table
    .getAllLeafColumns()
    .filter((col) => col.columnDef.enableGrouping);

  const currentGrouping = table.getState().grouping;
  const currentGroup = currentGrouping[0] || '';

  return groupableColumns.length > 0 ? (
    <div className='flex flex-row justify-start items-center mx-2'>
      <label htmlFor='group-column' className='text-gray-600 text-sm'>
        Agrupar por:
      </label>
      <select
        id='group-column'
        className='bg-gray-50 text-sm px-4 py-1.5 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors'
        value={currentGroup}
        onChange={(e) => {
          const value = (e.target as HTMLSelectElement).value;
          // Si se selecciona la opción vacía, se quita el agrupamiento
          table.setGrouping(value ? [value] : []);
        }}
        style={{
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.5rem center',
          backgroundSize: '1.5em 1.5em',
          paddingRight: '2.5rem',
        }}
      >
        <option value=''>Ninguno</option>
        {groupableColumns.map((col) => (
          <option key={col.id} value={col.id}>
            {typeof col.columnDef.header === 'string'
              ? col.columnDef.header
              : col.id}
          </option>
        ))}
      </select>
    </div>
  ) : null;
};
