export interface QrProps {
  name: string;
  onChange?: (event: KeyboardEvent<HTMLInputElement>) => void;
  label?: string;
  disabled?: boolean;
  value: any;
  page: string | undefined;
}
