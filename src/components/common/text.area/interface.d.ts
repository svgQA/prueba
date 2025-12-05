import { IInputProps } from '../input/interface';

export interface ITextAreaProps
  extends Omit<
    IInputProps,
    | 'type'
    | 'ref'
    | 'onChange'
    | 'onKeyUp'
    | 'onKeyDown'
    | 'onClick'
    | 'onFocus'
    | 'onBlur'
    | 'onInput'
  > {
  type?: 'text';
  ref?: React.RefObject<HTMLTextAreaElement>;
  onChange?: (event: TargetedEvent<HTMLTextAreaElement>) => void;
  onKeyUp?: (event: TargetedEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (event: TargetedEvent<HTMLTextAreaElement>) => void;
  onClick?: (event: TargetedEvent<HTMLTextAreaElement>) => void;
  onFocus?: (event: TargetedEvent<HTMLTextAreaElement>) => void;
  onBlur?: (event: TargetedEvent<HTMLTextAreaElement>) => void;
  onInput?: (event: TargetedEvent<HTMLTextAreaElement>) => void;
}
