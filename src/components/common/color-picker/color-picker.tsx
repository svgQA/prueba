import { FunctionComponent } from 'preact';
import { Input } from '../input/input';
import { useTranslation } from 'react-i18next';

interface ColorPickerProps {
  id?: string;
  name: string;
  label: string;
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  meta?: {
    touched?: boolean;
    error?: string;
  };
}

export const ColorPicker: FunctionComponent<ColorPickerProps> = ({
  id,
  name,
  label,
  value = '#000000',
  placeholder = '#000000',
  onChange,
  meta,
}) => {
  const { t } = useTranslation();
  return (
    <div>
      <Input
        id={id}
        name={name}
        label={t(label)}
        value={value}
        placeholder={t(placeholder)}
        type='color'
        onChange={(e) => {
          const target = e.target as HTMLInputElement;
          onChange?.(target.value);
        }}
        meta={meta}
      />
      <div
        className='mt-2 w-full h-8 rounded border border-gray-200 dark:border-gray-700'
        style={{ backgroundColor: value }}
      />
    </div>
  );
};
