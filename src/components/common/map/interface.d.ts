import { type IComponentProps } from '@/components/utils/interface';

export interface IMapProps extends IComponentProps {
  sendPoints: (data: any[]) => void;
  pointsAmount: number;
  pointsRef: any;
  condition: boolean,
  errorCondition: string,
  radialPoint: any,
  errorRadialPoint: string,
  draggable?: boolean,
  width?: string,
  height?: string
  clickPoint: (data: any) => void;
}

export interface Marker {
  id: number;
  position: any;
}
