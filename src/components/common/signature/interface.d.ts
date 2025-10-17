export interface SignatureProps {
  name: string;
  onChange?: (event: KeyboardEvent<HTMLInputElement>) => void;
  label?: string;
  disabled?: boolean;
  value: any;
}
