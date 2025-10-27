import { IOption } from '../multi/interface';

export interface MentionOption extends IOption {
  groupName?: string;
}

interface MentionGroup {
  name: string;
  options: MentionOption[];
}

export interface MentionEditorProps {
  value: string;
  onChange: (html: string) => void;
  groups: MentionGroup[];
  placeholder?: string;
  className?: string;
}
