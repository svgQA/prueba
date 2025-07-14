import { Memo } from '../utils/memos';
import HistoryInfo from './expandable/history.expandable';
import SupervisorInfo from './expandable/supervisor.expandable';

type Props = {
  type?: string;
  data: Memo;
};

const getInfoContent = (type: string, data: Memo) => {
  switch (type) {
    case 'expandable':
      return <SupervisorInfo memo={data} />;
    case 'history':
      return <HistoryInfo memo={data} />;
    default:
      return <>No content</>;
  }
};

export const ExpandableMultiple = ({ type, data }: Props) => {
  return (
    <div className='info-container'>
      {type && data && getInfoContent(type, data)}
    </div>
  );
};
