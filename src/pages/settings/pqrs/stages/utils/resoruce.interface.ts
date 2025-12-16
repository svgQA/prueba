export interface IResourceStage {
  type: 'internal' | 'external';
  internal?: IModuleUrl;
  external?: IModuleExternalUrl;
}

export enum modulesResource {
  AREA = 'area',
  PRIORITY = 'priority',
  INFO_CONTRACT = 'info-contract',
  WORK_ORDERS = 'work-orders',
  WORK_UNITS = 'work-units',
}

export enum IdsRequests {
  AREA = 'area',
  PQRS = 'pqrs',
}

export interface IModuleExternalUrl {
  method: HttpMethod;
  requestUrl: string;
};

export interface IModuleUrl {
  module: modulesResource;
  service: ServiceUrl;
  endpoint: string[] | string;
  idsRequests?: IdsRequests;
  method: HttpMethod;
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export enum ServiceUrl {
  TRYVOO = 'tryvoo',
  STEP = 'step',
}

export const listModulesUrls: IModuleUrl[] = [
  {
    module: modulesResource.AREA,
    service: ServiceUrl.TRYVOO,
    endpoint: ['area', 'simple', 'list'],
    method: HttpMethod.GET,
  },
  {
    module: modulesResource.PRIORITY,
    service: ServiceUrl.TRYVOO,
    endpoint: ['priorities', 'simple', 'list'],
    method: HttpMethod.GET,
  },
  {
    module: modulesResource.INFO_CONTRACT,
    service: ServiceUrl.STEP,
    endpoint: ['media-info', 'info-contract'],
    method: HttpMethod.GET,
    idsRequests: IdsRequests.PQRS,
  },
  {
    module: modulesResource.WORK_ORDERS,
    service: ServiceUrl.STEP,
    endpoint: ['media-info', 'work-orders'],
    method: HttpMethod.GET,
    idsRequests: IdsRequests.PQRS,
  },
  {
    module: modulesResource.WORK_UNITS,
    service: ServiceUrl.STEP,
    endpoint: ['media-info', 'work-units'],
    method: HttpMethod.GET,
    idsRequests: IdsRequests.PQRS,
  },
];
