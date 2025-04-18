export interface AlertProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}
