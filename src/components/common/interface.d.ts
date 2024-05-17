export interface IComponentProps {
  id: string;
  name: string;
}

export interface IMenu {
  label: string;
  description: string;
  icon?: string;
  to: string;
}
