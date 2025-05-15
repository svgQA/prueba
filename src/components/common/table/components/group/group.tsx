import { Button } from '@/components/common/button/button';
import { Table } from '@tanstack/react-table';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/hooks';

interface IGroupProps<T> {
  table: Table<T>;
  className?: string;
}

export const Group = <T,>({ table, className = '' }: IGroupProps<T>) => {
  const groupableColumns = useMemo(
    () =>
      table.getAllLeafColumns().filter((col) => col.columnDef.enableGrouping),
    [table]
  );

  const currentGrouping = table.getState().grouping;
  const currentGroup = currentGrouping[0] || '';
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, handleClickOutside]);

  if (groupableColumns.length === 0) return null;

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <Button
        name='group-none-filter'
        onClick={() => setIsOpen(!isOpen)}
        icon='231'
        square
        borderless
      />

      {isOpen && (
        <div className='absolute right-0 mt-1 w-48 bg-white dark:bg-b-dark-dark rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50'>
          <button
            className={`
              w-full px-4 py-2.5 text-sm text-left border-none
              ${!currentGroup ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}
              transition-colors
            `}
            onClick={() => {
              table.setGrouping([]);
              setIsOpen(false);
            }}
          >
            Ninguno
          </button>

          {groupableColumns.map((col) => (
            <Button
              key={col.id}
              name={`group-${col.id}-filter`}
              onClick={() => {
                table.setGrouping([col.id]);
                setIsOpen(false);
              }}
              full
              selected={col.id === currentGroup}
              borderless
              label={
                typeof col.columnDef.header === 'string'
                  ? col.columnDef.header
                  : col.id
              }
              icon='004'
            />
          ))}
        </div>
      )}
    </div>
  );
};
