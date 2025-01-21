import { useState, useCallback, useMemo } from 'preact/hooks';
import { IMultiProps } from './interface';
import { Chip } from '../chip/chip';
import { Input } from '../input/input';

export const MultipleInput = ({
  value = [],
  onSelect,
  onChange,
  label,
  name,
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
  ...options
}: IMultiProps) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' && inputValue) {
        e.preventDefault(); // Prevent form submission
        const index =
          value && Array.isArray(value) && value.length > 1
            ? value[value.length - 1].value + 1
            : value.length;

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
    () =>
      Array.isArray(value) && value.length > 0 ? (
        <div
          className={`${scrollable ? 'max-w-full overflow-auto vox-scroll-design py-1' : 'flex-wrap'} flex gap-1 justify-center`}
        >
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
                  asdasd
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
        </div>
      ) : null,
    [value, handleDelete]
  );

  return (
    <div className='w-full'>
      {!bottom && defaultChips}
      <div className='flex flex-row justify-between items-end'>
        <Input
          {...options}
          type='text'
          label={label}
          name={name}
          id={id}
          icon={icon}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || 'Type and press Enter'}
          thin
          borderless
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
