import { type FunctionComponent } from 'preact';
import { IExpandableProps } from './interface';

export const ExpandableShift: FunctionComponent<IExpandableProps> = ({
  row,
}: IExpandableProps) => {
  return (
    <div>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <div>
          <h4>Check In</h4>
          <p>Date: {row.checkIn.date}</p>
          <p>Status: {row.checkIn.status}</p>
        </div>
        <div>
          <h4>Check Out</h4>
          <p>Date: {row.checkOut.date}</p>
          <p>Status: {row.checkOut.status}</p>
        </div>
      </div>
    </div>
  );
};
