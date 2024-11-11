import { type FunctionComponent } from 'preact';
import { IExpandableProps } from './interface';

export const ExpandableMemos: FunctionComponent<IExpandableProps> = ({
  row,
}: IExpandableProps) => {
  return (
    <div>
      <h3>MEMOS</h3>
      {JSON.stringify(row)}
    </div>
  );
};
