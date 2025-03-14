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
        className='inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 bg-white rounded-md border border-gray-200 hover:bg-gray-50'
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          className='w-4 h-4 text-gray-500'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
        >
          <path
            d='M3 4h18M3 12h12M3 20h6'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
        {displayText && <span>{displayText}</span>}
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
        >
          <path d='M6 9l6 6 6-6' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
      </button>

      {isOpen && (
        <div
          className='
          absolute right-0 mt-1 w-48
          bg-white rounded-lg shadow-lg
          border border-gray-100
          py-1 z-50
        '
        >
          <button
            className={`
              w-full px-4 py-2.5 text-sm text-left
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
                w-full px-4 py-2.5 text-sm text-left
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
