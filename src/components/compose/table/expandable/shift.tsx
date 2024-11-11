import { type FunctionComponent } from 'preact';
import { IExpandableProps } from './interface';

export const ExpandableShift: FunctionComponent<IExpandableProps> = ({
  row,
}: IExpandableProps) => {
  return (
    <div>
      <h3>SHIFT</h3>
      {JSON.stringify(row)}
    </div>
  );
};
