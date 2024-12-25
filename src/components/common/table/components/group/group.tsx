// src/components/common/table/components/group/group.tsx

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

// import { FunctionComponent } from 'preact';
// import { useState } from 'preact/hooks';
// import { Table } from '@tanstack/react-table';

// interface IGroupProps<T> {
//   table: Table<T>;
// }

// export const Group = <T,>({ table }: IGroupProps<T>) => {
//   const [selectedColumn, setSelectedColumn] = useState('');

//   const groupableColumns = table.getAllLeafColumns().filter((col) => {
//     // Si la columna tiene enableGrouping: true, se puede agrupar
//     return (col.columnDef as any)?.enableGrouping === true;
//   });

//   const handleGroup = () => {
//     if (selectedColumn) {
//       // Agrupa por la columna seleccionada
//       table.setGrouping([selectedColumn]);
//     } else {
//       // Sin columna seleccionada, se quita el agrupamiento
//       table.setGrouping([]);
//     }
//   };

//   return (
//     <div className='flex items-center space-x-2'>
//       <select
//         className='border rounded px-2 py-1'
//         value={selectedColumn}
//         onChange={(e) => {
//           const target = e.target as HTMLSelectElement;
//           setSelectedColumn(target.value);
//         }}
//       >
//         <option value=''>Sin agrupamiento</option>
//         {groupableColumns.map((col) => (
//           <option key={col.id} value={col.id}>
//             {typeof col.columnDef.header === 'string'
//               ? col.columnDef.header
//               : col.id}
//           </option>
//         ))}
//       </select>
//       <button
//         className='border rounded px-3 py-1 bg-gray-100 hover:bg-gray-200'
//         onClick={handleGroup}
//       >
//         Agrupar datos
//       </button>
//     </div>
//   );
// };
