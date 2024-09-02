import { type FunctionComponent } from 'preact';
import { type ISliderProps } from './interface';

export const Slider: FunctionComponent<ISliderProps> = ({
  id,
  name,
}: ISliderProps) => {
  return <div id={id} name={name}></div>;
};
