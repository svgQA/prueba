import { type FunctionComponent } from 'preact';
import { type ICardProps } from './interface';

export const Card: FunctionComponent<ICardProps> = ({
  id,
  name,
}: ICardProps) => {
  return <div id={id} name={name}></div>;
};
