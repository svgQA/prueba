import { type IComponentProps } from '@/components/utils/interface';

export interface IMapProps extends IComponentProps {
  sendPoints: (data: any[]) => void;
  pointsAmount: number;
  pointsRef: any;
  condition: boolean;
  errorCondition: string;
  radialPoint: any;
  errorRadialPoint: string;
  draggable?: boolean;
  width?: string;
  height?: string;
  clickPoint?: (data: any) => void;
  center?: {
    lat: number;
    lng: number;
  };
}

export interface Marker {
  id: number;
  position: any;
}
