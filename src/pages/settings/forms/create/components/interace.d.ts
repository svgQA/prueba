import { IElement } from '../store';

export interface IElementProps {
  question: IElement;
  index: number;
  page: string;
  section?: string;
  selected?: boolean;
  onSelect: (id: string, page: string, section?: string) => void;
  onDelete: (id: string, page: string, section?: string) => void;
}
