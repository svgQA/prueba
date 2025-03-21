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

  const selectedColumnName = useMemo(() => {
    if (!currentGroup) return '';
    const column = groupableColumns.find((col) => col.id === currentGroup);
    const header = column?.columnDef.header;
    if (typeof header === 'string') return header;
    if (typeof header === 'function') return column?.id;
    return column?.id || '';
  }, [currentGroup, groupableColumns]);

  const displayText = useMemo(
    () => (currentGroup ? selectedColumnName : ''),
    [currentGroup, selectedColumnName]
  );

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
      <button
        type='button'
        className='inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 bg-white rounded-md hover:bg-gray-50'
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className='vox-icon vx-icon-120 text-gray-500' />
        {displayText && <span>{displayText}</span>}
        <span className='vox-icon vx-icon-001 text-gray-500' />
      </button>

      {isOpen && (
        <div className='absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border-2 border-gray-100 py-1 z-50'>
          <button
            className={`
              w-full px-4 py-2.5 text-sm text-left border-none
              ${!currentGroup ? 'text-blue-600 bg-blue-50/50' : 'text-gray-600 hover:bg-gray-50'}
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
            <button
              key={col.id}
              className={`
                w-full px-4 py-2.5 text-sm text-left border-none
                ${col.id === currentGroup ? 'text-blue-600 bg-blue-50/50' : 'text-gray-600 hover:bg-gray-50'}
                transition-colors
              `}
              onClick={() => {
                table.setGrouping([col.id]);
                setIsOpen(false);
              }}
            >
              {typeof col.columnDef.header === 'string'
                ? col.columnDef.header
                : col.id}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
