import { FunctionComponent } from 'preact';
import { ITableFilterProps } from './interface';

export const Filter: FunctionComponent<ITableFilterProps> = ({
  column,
  table,
}) => {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  return typeof firstValue === 'number' ? (
    <div className='flex space-x-2' onClick={(e) => e.stopPropagation()}>
      <input
        type='number'
        value={(columnFilterValue as [number, number])?.[0] ?? ''}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            //@ts-ignore
            e?.target?.value,
            old?.[1],
          ])
        }
        placeholder={`Min`}
        className='w-24 border shadow rounded'
      />
      <input
        type='number'
        value={(columnFilterValue as [number, number])?.[1] ?? ''}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            old?.[0],
            //@ts-ignore
            e?.target?.value,
          ])
        }
        placeholder={`Max`}
        className='w-24 border shadow rounded'
      />
    </div>
  ) : (
    <input
      className='w-36 border shadow rounded'
      // @ts-ignore
      onChange={(e) => column.setFilterValue(e?.target?.value)}
      onClick={(e) => e.stopPropagation()}
      placeholder={`Search...`}
      type='text'
      value={(columnFilterValue ?? '') as string}
    />
  );
};
