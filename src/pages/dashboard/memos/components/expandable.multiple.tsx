import { Memo } from '../utils/memos';
import HistoryInfo from './expandable/history.expandable';
import SupervisorInfo from './expandable/supervisor.expandable';

type Props = {
  type?: string;
  data: Memo;
  onStatusChange?: (newStatus: string, memoId: number) => void;
};

const getInfoContent = (
  type: string,
  data: Memo,
  onStatusChange?: (newStatus: string, memoId: number) => void
) => {
  switch (type) {
    case 'expandable':
      return <SupervisorInfo memo={data} onStatusChange={onStatusChange} />;
    case 'history':
      return <HistoryInfo memo={data} />;
    default:
      return <>No content</>;
  }
};

export const ExpandableMultiple = ({ type, data, onStatusChange }: Props) => {
  return (
    <div className='info-container'>
      {type && data && getInfoContent(type, data, onStatusChange)}
    </div>
  );
};
