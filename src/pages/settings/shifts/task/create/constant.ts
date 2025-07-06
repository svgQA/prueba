import { IOption } from '@/components/common/multi/interface';

const ATTACHMENT_TYPES = [
  'GENERAL',
  'DOCUMENT',
  'AUDIO',
  'VIDEO',
  'PHOTO',
  'FORMS',
] as const;
export const ATTACHMENT_OPTIONS: IOption[] = ATTACHMENT_TYPES.map((t) => ({
  value: t,
  label: t.charAt(0) + t.slice(1).toLowerCase(),
}));

const TASK_TYPES = ['GENERAL', 'REPORT'] as const;
export const TASK_TYPE_OPTIONS: IOption[] = TASK_TYPES.map((t) => ({
  value: t,
  label: t.charAt(0) + t.slice(1).toLowerCase(),
}));
