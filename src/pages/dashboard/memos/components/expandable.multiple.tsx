import { Memo } from '../utils/memos';
import HistoryInfo from './expandable/history.expandable';
import SupervisorInfo from './expandable/supervisor.expandable';

enum InfoType {
  SUPERVISOR = 'supervisor',
  HISTORY = 'history',
}

type Props = {
  type: string;
  data: Memo;
};

const getInfoContent = (type: string = InfoType.SUPERVISOR, data: Memo) => {
  switch (type) {
    case InfoType.SUPERVISOR:
      return <SupervisorInfo memo={data} />;
    case InfoType.HISTORY:
      return <HistoryInfo memo={data} />;
  }
};

export const ExpandableMultiple = ({ type, data }: Props) => {
  return <div class='info-container'>{getInfoContent(type, data)}</div>;
};
