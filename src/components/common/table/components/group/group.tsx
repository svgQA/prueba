import { Table } from '@tanstack/react-table';

interface IGroupProps<T> {
  table: Table<T>;
}

export const Group = <T,>({ table }: IGroupProps<T>) => {
  // Filtramos las columnas que se pueden agrupar
  const groupableColumns = table
    .getAllLeafColumns()
    .filter((col) => col.columnDef.enableGrouping);

  // Tomamos la primera columna agrupable seleccionada, si la hay
  const currentGrouping = table.getState().grouping;
  const currentGroup = currentGrouping[0] || '';

  return (
    <div className='w-full flex items-center mb-2 gap-2 justify-end'>
      {groupableColumns.length > 0 && (
        <>
          <label htmlFor='group-column' className='text-gray-700'>
            Agrupar por:
          </label>
          <select
            id='group-column'
            className='border rounded px-2 py-1 text-sm'
            value={currentGroup}
            onChange={(e) => {
              const value = (e.target as HTMLSelectElement).value;
              // Si se selecciona la opción vacía, se quita el agrupamiento
              table.setGrouping(value ? [value] : []);
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
        </>
      )}
    </div>
  );
};
