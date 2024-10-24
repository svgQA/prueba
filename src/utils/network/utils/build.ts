interface IServicesModel {
  name: 'Tenant' | 'Shift' | 'Auth';
  value?: string;
}

export const generate = (
  services: IServicesModel[],
  def: string = 'http://localhost:8080'
) => {
  return services.reduce(
    (pre, curr) => ({ ...pre, [`${curr.name}Service`]: curr?.value || def }),
    {}
  );
};
