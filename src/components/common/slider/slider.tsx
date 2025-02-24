import { type FunctionComponent } from 'preact';
import { type ISliderProps } from './interface';

export const Slider: FunctionComponent<ISliderProps> = ({
  id,
}: ISliderProps) => {
  return <div id={id}></div>;
};
