import { useState, useCallback, useMemo } from 'preact/hooks';
import { IMultiProps } from './interface';
import { Chip } from '../chip/chip';
import { Input } from '../input/input';

export const MultipleInput = ({
  value = [],
  onSelect,
  onChange,
  label,
  name = 'multiple-input',
  id,
  icon,
  buttonIcon = '123',
  buttonType = 'button',
  button,
  bottom,
  placeholder,
  getElement,
  ellipse,
  scrollable,
  meta,
  ...options
}: IMultiProps) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' && inputValue) {
        // e.stopPropagation();
        e.preventDefault(); // Prevent form submission
        let index: number | string = 0;
        if (Array.isArray(value) && value.length > 0) {
          const position = value.length - 1;
          const _value = value[position]?.value;
          if (typeof _value === 'number') {
            index = _value + 1;
          } else {
            index = `${value.length + 1}`;
          }
        }

        const newValue = [...value, { value: index, label: inputValue }];
        onChange(newValue, name);
        setInputValue('');
      }
    },
    [inputValue, value, onChange, name]
  );

  const handleDelete = useCallback(
    (chipToDelete: string | number) => {
      const newValue = value.filter((item) => item.value !== chipToDelete);
      onChange(newValue, name);
    },
    [value, onChange, name]
  );

  const handleInputChange = useCallback((e: Event) => {
    const target = e.target as HTMLInputElement;
    setInputValue(target.value);
  }, []);

  const defaultChips = useMemo(
    () => (
      <div className='flex flex-row gap-1 min-h-8  max-w-96 overflow-auto vox-scroll-design py-1 shadow-inner'>
        {Array.isArray(value) && value.length > 0 ? (
          <>
            {value.map((item, index) => {
              const total = ellipse || value.length;
              return index < total ? (
                getElement ? (
                  <div className='relative border rounded-md flex flex-col border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'>
                    <span
                      className='absolute z-10 right-2 top-0.5 vox-icon vx-icon-192 size-sm cursor-pointer'
                      onClick={() => handleDelete(item.value)}
                    ></span>
                    {getElement(item, index)}
                  </div>
                ) : (
                  <Chip
                    key={item.value}
                    label={item.label}
                    onDelete={() => handleDelete(item.value)}
                  />
                )
              ) : null;
            })}
            {(ellipse || Infinity) < value.length && (
              <span className='vox-icon vx-icon-085' />
            )}
          </>
        ) : null}
      </div>
    ),
    [value, handleDelete]
  );

  return (
    <div className='w-full flex flex-col gap-1 items-center'>
      {!bottom && defaultChips}
      <div className='flex flex-row justify-between items-end w-full'>
        <Input
          {...options}
          type='text'
          label={label}
          name={name}
          meta={meta}
          id={id}
          icon={icon}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || 'Type and press Enter'}
          thin
          button
          onClick={onSelect}
          buttonIcon={buttonIcon}
          buttonType={buttonType}
        />
      </div>
      {bottom && defaultChips}
    </div>
  );
};
