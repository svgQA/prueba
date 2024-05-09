import { type FunctionComponent } from 'preact';
import { type IMapProps } from './interface';

export const Map: FunctionComponent<IMapProps> = ({ id, name }: IMapProps) => {
  return <div id={id} name={name}></div>;
};
