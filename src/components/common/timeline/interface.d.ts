import { type IComponentProps } from '@/components/utils/interface';

interface ITimelineElement {
  icon: string;
  title: string;
  time?: string;
  description?: string;
}

interface ITimelineProps extends IComponentProps {
  elements: ITimelineElement[];
}
