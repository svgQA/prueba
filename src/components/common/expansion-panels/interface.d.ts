export interface IExpansionPanelProps {
  id?: string;
  name?: string;
  title: string;
  subtitle?: string;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  onAdd?: () => void;
} 