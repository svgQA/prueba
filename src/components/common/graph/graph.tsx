import { type FunctionComponent } from 'preact';
import { type IGraphProps } from './interface';

export const Graph: FunctionComponent<IGraphProps> = ({ id }: IGraphProps) => {
  return <div id={id}></div>;
};
