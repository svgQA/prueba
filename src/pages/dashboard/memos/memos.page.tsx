import { type FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { memosData } from './memos.data';
import { Memo } from './memos.d';
import { Table } from '@/components/common/table/table'; // Asegúrate de que la ruta es correcta
import { memosColumns } from './memos.columns'; // Asegúrate de que esta importación se usa

export const MemosPage: FunctionComponent = () => {
  const [data, setData] = useState<Memo[]>([]); // Estado para almacenar los datos
  const [globalFilter, setGlobalFilter] = useState(''); // Filtro global

  useEffect(() => {
    document.title = 'VX - Memos Service'; // Establecer el título del documento
    setData(memosData); // Cargar los datos de los memos
  }, []);

  return (
    <section className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Gestión de Memos</h1>
      <div className='mb-4'>
        <input
          type='text'
          placeholder='Buscar memos...'
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.currentTarget.value)}
          className='w-full p-2 border border-gray-300 rounded'
        />
      </div>
      {/* Usar las columnas importadas y pasar los datos a la tabla */}
      <Table
        data={data} // Pasar los datos cargados
        columns={memosColumns} // Pasar las columnas importadas
        pageSize={16} // Tamaño de página, ajusta según sea necesario
      />
    </section>
  );
};

// import { type FunctionComponent } from 'preact';
// import { useEffect, useState } from 'preact/hooks';
// import { memosData } from './memos.data';  // Asegúrate de que los datos se importen correctamente
// import { Memo } from './memos.d';
// import { Table } from '@/components/common/table/table';  // Asegúrate de que la tabla esté importada
// import { memosColumns } from './memos.columns'; // Importar las columnas correctamente

// export const MemosPage: FunctionComponent = () => {
//   const [data, setData] = useState<Memo[]>([]);  // Estado para almacenar los datos
//   const [globalFilter, setGlobalFilter] = useState('');  // Estado para el filtro global

//   // Usamos useEffect para inicializar los datos
//   useEffect(() => {
//     document.title = 'VX - Memos Service';
//     setData(memosData);  // Establecemos los datos de prueba
//   }, []);

//   return (
//     <section className='p-4'>
//       <h1 className='text-2xl font-bold mb-4'>Gestión de Memos</h1>
//       <div className='mb-4'>
//         <input
//           type='text'
//           placeholder='Buscar memos...'
//           value={globalFilter}
//           onChange={(e) => setGlobalFilter(e.currentTarget.value)}
//           className='w-full p-2 border border-gray-300 rounded'
//         />
//       </div>
//       <Table<Memo>
//         data={data}  // Pasamos los datos al componente de la tabla
//         columns={memosColumns}  // Pasamos las columnas configuradas
//         pageSize={15}
//       />
//     </section>
//   );
// };
