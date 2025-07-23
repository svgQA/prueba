import { type IComponentProps } from '@/components/utils/interface';

export interface IMapProps extends IComponentProps {
  sendPoints: (data: MapPoint[]) => void;
  pointsAmount?: number;
  pointsRef: any;
  condition?: boolean;
  errorCondition?: string;
  radialPoint?: any;
  errorRadialPoint?: string;
  draggable?: boolean;
  width?: string;
  height?: string;
  clickPoint?: (data: MapPoint) => void;
  center?: {
    lat: number;
    lng: number;
  };
  allowManualPoint?: boolean;
  radius?: number;
  disablePointSelection?: boolean;
  adminUser?: boolean;
}

export interface MapPoint {
  id: number;
  name: string;
  position: { lat: number; lng: number };
}

export interface Marker {
  id: number;
  position: any;
}

export interface IPointMap {
  id: number;
  position: {
    lat: number;
    lng: number;
  };
  tasks: ITask[];
}
