import { useRef, useCallback, useMemo } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { IKey, ISearchProps } from './interface';
import { TargetedEvent } from 'preact/compat';
import { ColumnFiltersState } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { ReportAutomatic } from '../report-automatic/report-automatic';
import { RangeExport } from '../range-export/range-export';
import { IRangeValues, RangeDateFilter } from '../table/components/range/range';
import { DateUtils } from '@/utils/utilities/dates';
import { TextEllipsis } from '../text-ellipsis';

export const Search = ({
  id,
  keys = [],
  lenThreshold = 0,
  placeholder,
  value = [],
  onChange,
  table,
  group,
  grouping,
  disabled = false,
  onRangeChange,
  modules,
  range,
}: ISearchProps) => {
  const { t } = useTranslation();
  const inputState = useSignal<string>('');
  const searchArray = useSignal<ColumnFiltersState>(value);
  const selectedKeyIndex = useSignal<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const keysContainerRef = useRef<HTMLDivElement>(null);
  const isDropdownOpen = useSignal<boolean>(false);
  const isOpenRange = useSignal<boolean>(false);
  const columnSelected = useSignal<IKey>({ id: '0', label: '', type: 'date' });

  const handleChangeInput = useCallback(
    (event: TargetedEvent<HTMLInputElement, Event>) => {
      if (event.target instanceof HTMLInputElement) {
        const { value } = event.target;
        inputState.value = value;

        if (value.length > lenThreshold) {
          isDropdownOpen.value = true;
        } else {
          isDropdownOpen.value = false;
        }
      }
    },
    [lenThreshold]
  );

  const setFilter = (filter: ColumnFiltersState, update = true) => {
    searchArray.value = filter;
    if (!onChange || !update) return;
    onChange(searchArray.value);
  };

  const selectKey = useCallback(
    (selected: IKey, _value?: string) => {
      return (prev: ColumnFiltersState) => {
        const id = selected.id;
        const value = _value || inputState.value.trim();
        const type = selected.type;
        const existingIndex = prev.findIndex((item) => item.id === id);
        if (existingIndex !== -1) {
          const updatedItem = {
            ...prev[existingIndex],
            value: [...(prev[existingIndex].value as string[]), value],
            type,
          };
          return [
            ...prev.slice(0, existingIndex),
            updatedItem,
            ...prev.slice(existingIndex + 1),
          ];
        } else {
          return [...prev, { id, value: [value], type }];
        }
      };
    },
    [inputState.value]
  );

  const setFilterSelected = useCallback(
    (key: IKey, update = true, value?: string) => {
      const setSearch = selectKey(key, value);
      setFilter(setSearch(searchArray.value), update);
      inputState.value = '';
      selectedKeyIndex.value = -1;
      isDropdownOpen.value = false;

      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 10);
    },
    [searchArray, selectKey, inputState]
  );

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (isDropdownOpen.value && keys.length > 0) {
        if (event.key === 'Enter' && inputState.value.trim() !== '') {
          event.preventDefault();
          const key =
            selectedKeyIndex.value !== -1
              ? keys[selectedKeyIndex.value]
              : keys[0];
          if (!key) return;
          if (key.type === 'date') {
            isOpenRange.value = true;
            columnSelected.value = key;
            return;
          }
          setFilterSelected(key);
        } else if (event.key === 'Tab') {
          event.preventDefault();
          if (selectedKeyIndex.value === -1) {
            selectedKeyIndex.value = 0;
          } else {
            selectedKeyIndex.value = (selectedKeyIndex.value + 1) % keys.length;
          }
          if (keysContainerRef.current) {
            const selectedElement = keysContainerRef.current.children[
              selectedKeyIndex.value + 1
            ] as HTMLElement;
            if (selectedElement) {
              selectedElement.focus();
              selectedElement.scrollIntoView({ block: 'nearest' });
            }
          }
        } else if (event.key === 'ArrowDown') {
          event.preventDefault();
          selectedKeyIndex.value =
            selectedKeyIndex.value === -1
              ? 0
              : (selectedKeyIndex.value + 1) % keys.length;
          if (keysContainerRef.current) {
            const selectedElement = keysContainerRef.current.children[
              selectedKeyIndex.value + 1
            ] as HTMLElement;
            if (selectedElement) {
              selectedElement.focus();
              selectedElement.scrollIntoView({ block: 'nearest' });
            }
          }
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          selectedKeyIndex.value =
            selectedKeyIndex.value === -1
              ? keys.length - 1
              : (selectedKeyIndex.value - 1 + keys.length) % keys.length;
          if (keysContainerRef.current) {
            const selectedElement = keysContainerRef.current.children[
              selectedKeyIndex.value + 1
            ] as HTMLElement;
            if (selectedElement) {
              selectedElement.focus();
              selectedElement.scrollIntoView({ block: 'nearest' });
            }
          }
        }
      } else if (event.key === 'Backspace' && inputState.value === '') {
        setFilter(searchArray.value.slice(0, -1));
      } else if (event.key === 'Escape') {
        isDropdownOpen.value = false;
        selectedKeyIndex.value = -1;
      }
    },
    [
      inputState.value,
      keys,
      setFilterSelected,
      searchArray,
      isDropdownOpen.value,
    ]
  );

  const handleClickFilters = useCallback(
    (event: TargetedEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;
      if (target instanceof HTMLSpanElement) {
        const name = target.getAttribute('data-name');
        if (name && name.startsWith('filter-delete-')) {
          const key = name.split('-')[2];
          if (!key) return;
          setFilter(searchArray.value.filter((item) => item.id !== key));
        }
      }
    },
    [searchArray]
  );

  const handleClickKeys = useCallback(
    (event: TargetedEvent<HTMLDivElement>) => {
      const target = event.target as HTMLDivElement;
      const name = target.getAttribute('data-name');
      if (name && name.startsWith('filter-key-')) {
        const id = target.getAttribute('data-id');
        const label = target.getAttribute('data-label');
        const type = target.getAttribute('data-type');
        if (!id || !label || !type) return;

        if (type === 'date') {
          isOpenRange.value = true;
          columnSelected.value = { id, label, type };
          return;
        }

        setFilterSelected({ id, label, type });
      }
    },
    [setFilterSelected]
  );

  const keysList = useMemo(
    () =>
      keys
        .filter((key) => key.id !== 'actions')
        .map((key, index) => {
          const keyName = `filter-key-${key.id}-${index}`;
          return (
            <div
              className={`relative px-3 py-1 my-1 cursor-pointer flex flex-row min-w-40 rounded-md transition-colors duration-150 ${
                index === selectedKeyIndex.value
                  ? 'bg-primary-opacity text-primary'
                  : 'hover:bg-b-light hover:text-primary'
              }`}
              key={keyName}
              tabIndex={0}
              onKeyDown={handleKeyPress}
            >
              <span
                className='absolute top-0 left-0 w-full h-full'
                data-name={keyName}
                data-id={key.id}
                data-label={key.label}
                data-type={key.type}
              />
              <span className='px-2 mr-1 font-medium text-sm capitalize'>
                {t(key.label)}:
              </span>
              <span className='text-sm font-normal'>{inputState.value}</span>
            </div>
          );
        }),
    [
      keys,
      selectedKeyIndex.value,
      inputState.value,
      setFilterSelected,
      handleKeyPress,
    ]
  );

  const searchList = useMemo(
    () =>
      searchArray.value.map((item, index) => {
        const keyName = `filter-search-${item.id}-${index}`;
        const key = keys.find((k) => k.id === item.id);
        const keyLabel = key?.label || item.id;
        const keyType = key?.type || 'text';

        return (
          <div key={keyName} className='relative'>
            <div
              data-name={keyName}
              className='flex items-center h-7 px-2 py-1 bg-primary-opacity dark:bg-ternary dark:text-white text-primary rounded-xl cursor-pointer gap-1 transition-all hover:bg-primary-opacity-2 text-sm'
            >
              <span className='font-medium flex flex-row justify-between gap-1'>
                <strong>{t(keyLabel)}: </strong>
                <TextEllipsis
                  text={String(item.value)}
                  maxWidth='200px'
                ></TextEllipsis>
              </span>
              <span
                className='ml-1 hover:text-ternary cursor-pointer flex items-center justify-center w-4 h-4 rounded-full hover:bg-primary-opacity-2'
                onClick={(e) => {
                  e.stopPropagation();
                  setFilter(searchArray.value.filter((f) => f.id !== item.id));
                  if (keyType === 'date' && onRangeChange) onRangeChange(null);
                }}
              >
                ×
              </span>
            </div>
          </div>
        );
      }),
    [searchArray.value, keys]
  );

  const handleClickOutside = (e: MouseEvent) => {
    if (
      isDropdownOpen.value &&
      keysContainerRef.current &&
      !keysContainerRef.current.contains(e.target as Node) &&
      inputRef.current &&
      !inputRef.current.contains(e.target as Node)
    ) {
      isDropdownOpen.value = false;
      selectedKeyIndex.value = -1;
    }
  };

  if (typeof document !== 'undefined') {
    document.addEventListener('click', handleClickOutside);
  }

  return (
    <div
      id={id}
      className='flex flex-row items-center h-10 w-full max-w-[850px] px-3 border rounded-xl relative bg-white dark:bg-b-dark-dark border-gray-200 dark:border-gray-700'
    >
      <span className='vox-icon vx-icon-153 text-gray-500 dark:text-gray-400 !text-lg' />
      <div
        className='flex flex-row items-center gap-1 ml-2 flex-wrap'
        onClick={handleClickFilters}
      >
        {searchList}
      </div>
      <div className='flex-1 flex items-center'>
        <input
          ref={inputRef}
          className='w-full px-2 py-0.5 bg-transparent outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 text-base'
          placeholder={t(placeholder || 'p_general_search')}
          onChange={handleChangeInput}
          onKeyDown={handleKeyPress}
          onFocus={() => {
            if (inputState.value.length > lenThreshold) {
              isDropdownOpen.value = true;
            }
          }}
          value={inputState.value}
          disabled={disabled}
        />
      </div>

      {/* {table && range && <>{range}</>} */}
      {(table || grouping) && group && <>{group}</>}
      {table && modules && <ReportAutomatic modules={modules} />}
      {/* {fileName && <FileControl fileName={fileName} />} */}
      {range && modules && <RangeExport />}

      {keys.length > 0 && isDropdownOpen.value && (
        <div
          ref={keysContainerRef}
          className='absolute right-0 top-full mt-2 min-w-56 border py-2 z-30 bg-white dark:bg-b-dark-dark rounded-xl border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-top-5 duration-150 max-h-[300px] overflow-y-auto vox-scroll-design'
          onClick={handleClickKeys}
        >
          <h6 className='px-3 py-1 text-xs text-gray-500 dark:text-gray-400 font-medium uppercase'>
            {t('l_filter')}
          </h6>
          {keysList}
        </div>
      )}

      <RangeDateFilter
        isOpen={isOpenRange}
        onRangeChange={(event?: IRangeValues | null) => {
          if (!event) return;
          setFilterSelected(
            columnSelected.value,
            false,
            String(
              `${DateUtils.dateToFrontend(event.data[0])} | ${DateUtils.dateToFrontend(event.data[1])}`
            )
          );
          onRangeChange?.(event);
        }}
        column={columnSelected.value?.id}
      />
    </div>
  );
};
