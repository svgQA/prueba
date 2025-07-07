import { DateUtils } from '@/utils/utilities/dates';

export const _onTaskAddSimple = (model: any) => {
  const task = Array.isArray(model)
    ? model.map((task: any) => ({
        ...task.task,
      }))
    : [model];
  return task;
};

export const _onTaskAddWithId = (model: any, len: number, id: number) => {
  const task = Array.isArray(model)
    ? model.map((task: any, index: number) => ({
        t: id,
        ...task.task,
        id: len + index,
      }))
    : [
        {
          t: id,
          id: len,
          ...model,
          hourStart: DateUtils.createUTCDateFromHour(
            model.hourStart || '00:00'
          ),
        },
      ];
  return task;
};
