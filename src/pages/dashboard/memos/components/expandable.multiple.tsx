import { Memo } from '../utils/memos';
import SupervisorInfo from './expandable/supervisor.expandable ';

enum InfoType {
  SUPERVISOR = 'supervisor',
}

type Props = {
  type: string;
  data: Memo;
};

const getInfoContent = (type: string, data: Memo) => {
  switch (type) {
    case InfoType.SUPERVISOR:
      return <SupervisorInfo memo={data} />;
  }
};

export const ExpandableMultiple = ({ type, data }: Props) => {
  return <div class='info-container'>{getInfoContent(type, data)}</div>;
};
