import { Memo } from '../utils/memos';
import HistoryInfo from './expandable/history.expandable';
import SupervisorInfo from './expandable/supervisor.expandable';
import { getPermissionByModuleState } from '@/store/signals/access/permission';
import i18n from '@/i18n';

type Props = {
  type?: string;
  data: Memo;
  onStatusChange?: (newStatus: string, memoId: number) => void;
};

const getInfoContent = ({ type, data, onStatusChange }: Props) => {
  switch (type) {
    case 'expandable':
      if (!getPermissionByModuleState('memo', 'chat'))
        return <>{i18n.t('permissions.view_denied')}</>;
      return <SupervisorInfo memo={data} onStatusChange={onStatusChange} />;
    case 'history':
      if (!getPermissionByModuleState('memo', 'chat'))
        return <>{i18n.t('permissions.view_denied')}</>;
      return <HistoryInfo memo={data} />;
    default:
      return <>No content</>;
  }
};

export const ExpandableMultiple = ({ type, data, onStatusChange }: Props) => {
  return (
    <div className='info-container'>
      {type && data && getInfoContent({ type, data, onStatusChange })}
    </div>
  );
};
