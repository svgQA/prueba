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
    ? model.map((task: any, index: number) => {
        const data = task.task ? task.task : task;
        return {
          t: id,
          ...data,
          id: len + index,
        };
      })
    : [
        {
          t: id,
          id: len,
          ...model,
        },
      ];
  return task;
};
