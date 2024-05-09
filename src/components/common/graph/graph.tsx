import { type FunctionComponent } from 'preact';
import { type IGraphProps } from './interface';

export const Graph: FunctionComponent<IGraphProps> = ({
  id,
  name,
}: IGraphProps) => {
  return <div id={id} name={name}></div>;
};
