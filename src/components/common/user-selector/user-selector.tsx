import { ComponentType } from 'preact';
import {
  CustomSelector,
  CustomSelectorProps,
} from '@/components/common/custom-selector/custom-selector';

interface UserSelectorProps extends CustomSelectorProps {}

export const UserSelector: ComponentType<UserSelectorProps> = (props) => {
  return (
    <CustomSelector
      {...props}
      placeholder={props.placeholder || 'Buscar usuarios...'}
    />
  );
};
