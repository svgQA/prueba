import { IInputProps } from '../input/interface';

export interface ITextAreaProps extends IInputProps {
  onChange?: (event: TargetedEvent<HTMLTextAreaElement>) => void;
}
