import { Field } from 'react-final-form';
import { DateUtils } from '@/utils/utilities/dates';
import { required } from '@/utils/utilities';
import { Input } from '@/components/common/input/input';
interface DateFieldProps {
  name: string;
  label: string;
  required?: boolean;
  id?: string;
  meta?: any;
  validate?: (value: any) => any;
  format?: 'time' | 'date' | 'full';
  placeholder?: string;
  disabled?: boolean;
  defaultToNow?: boolean;
  type?: 'time' | 'date' | 'datetime-local';
}

export const DateField = ({
  name,
  label,
  required: isRequired = false,
  id,
  validate,
  format = 'full',
  disabled = false,
  placeholder,
  defaultToNow = false,
  type = 'datetime-local',
}: DateFieldProps) => {
  return (
    <Field<string>
      name={name}
      validate={isRequired ? required : validate}
      parse={(value) => (value ? DateUtils.dateToBackend(value, format) : '')}
      format={(value) => (value ? DateUtils.dateToInput(value) : '')}
      initialValue={
        defaultToNow
          ? DateUtils.dateFormat(new Date(), 'YYYY-MM-DDTHH:mm')
          : undefined
      }
    >
      {({ input, meta }) => {
        return (
          <Input
            {...input}
            id={id || `input-${name}`}
            name={`input-${name}`}
            type={type}
            label={label}
            meta={meta}
            unicon
            icon='325'
            placeholder={placeholder}
            disabled={disabled}
          />
        );
      }}
    </Field>
  );
};
