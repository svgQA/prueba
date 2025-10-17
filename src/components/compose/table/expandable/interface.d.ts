import { Row } from '@tanstack/react-table';
import { type PropsWithChildren } from 'preact/compat';

interface IRound {
  pointId: number;
  // uuid: string;
  roundId: number;
  marker: {
    id: number;
    position: {
      lat: number;
      lng: number;
    };
  };
}

export interface IExpandableProps {
  // <T> {
  row: any; // Row<T>;
}
