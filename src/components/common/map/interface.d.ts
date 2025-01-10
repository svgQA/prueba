import { type IComponentProps } from '@/components/utils/interface';

export interface IMapProps extends IComponentProps {
  addPlaceEvent: (data: { latitude: number; longitude: number }) => void;
  markers: Marker[];
}

export interface Marker {
  id: number;
  position: any;
}
