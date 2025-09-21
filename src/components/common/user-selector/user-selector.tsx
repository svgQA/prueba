import { ComponentType } from 'preact';
import {
  CustomSelector,
  CustomSelectorProps,
} from '@/components/common/custom-selector/custom-selector';
import { useTranslation } from 'react-i18next';

interface UserSelectorProps extends CustomSelectorProps {}

export const UserSelector: ComponentType<UserSelectorProps> = (props) => {
  const { t } = useTranslation();
  return (
    <CustomSelector
      {...props}
      placeholder={t(props.placeholder || 'p_search_users')}
    />
  );
};
