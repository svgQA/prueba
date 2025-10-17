export interface AudioRecorderProps {
  name?: string;
  onChange?: (event: KeyboardEvent<HTMLInputElement>) => void;
  label?: string;
  disabled?: boolean;
  value: IPresignedRequest[];
  area?: AllowedAreaTypes;
  page: string | undefined;
}
