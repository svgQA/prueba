import { type FunctionComponent } from 'preact';
import { type IRelativeProps } from './interface';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.locale('es');

export const RelativeTime: FunctionComponent<IRelativeProps> = ({
  date,
}: IRelativeProps) => {
  return <p>{dayjs(date).fromNow()}</p>;
};
