export interface IResourceStage {
  type: 'internal' | 'external';
  internal?: IModuleUrl;
  external?: {
    method: Methods;
    requestUrl: string;
  };
}

export enum Methods {
  GET = 'GET',
  POST = 'POST',
}

export enum modulesResource {
  AREA = 'area',
  PRIORITY = 'priority',
  INFO_CONTRACT = 'info-contract',
  WORK_ORDERS = 'work-orders',
  WORK_UNITS = 'work-units',
}

enum IdsRequests {
  AREA = 'area',
  PQRS = 'pqrs',
}

interface IModuleUrl {
  module: modulesResource;
  service: 'tryvoo' | 'step';
  endpoint: string[] | string;
  idsRequests?: IdsRequests;
}

export const listModulesUrls: IModuleUrl[] = [
  {
    module: modulesResource.AREA,
    service: 'tryvoo',
    endpoint: ['area', 'simple', 'list'],
  },
  {
    module: modulesResource.PRIORITY,
    service: 'tryvoo',
    endpoint: ['priorities', 'simple', 'list'],
  },
  {
    module: modulesResource.INFO_CONTRACT,
    service: 'step',
    endpoint: ['media-info', 'info-contract'],
    idsRequests: IdsRequests.PQRS,
  },
  {
    module: modulesResource.WORK_ORDERS,
    service: 'step',
    endpoint: ['media-info', 'work-orders'],
    idsRequests: IdsRequests.PQRS,
  },
  {
    module: modulesResource.WORK_UNITS,
    service: 'step',
    endpoint: ['media-info', 'work-units'],
    idsRequests: IdsRequests.PQRS,
  },
];
