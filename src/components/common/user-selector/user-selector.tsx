import { ComponentType } from 'preact';
import { CustomSelector } from '@/components/common/custom-selector/custom-selector';
import { IOption } from '@/components/common/multi/interface';
import { FieldMetaState } from 'react-final-form';

interface UserSelectorProps {
  value?: IOption[];
  onChange: (value: IOption[]) => void;
  label?: string;
  placeholder?: string;
  meta?: FieldMetaState<IOption[]>;
  name: string;
  options: IOption[];
  multiple?: boolean;
}

export const UserSelector: ComponentType<UserSelectorProps> = (props) => {
  return (
    <CustomSelector
      {...props}
      placeholder={props.placeholder || 'Buscar usuarios...'}
    />
  );
};
