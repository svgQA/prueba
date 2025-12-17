export interface IResourceResponse {
  id: number;
  name: string;
  type: string;
  description: string;
  image: string;
  icon: string;
  link: string;
  groups: Array<{
    group: {
      id: number;
      name: string;
    };
  }>;
  updatedAt: Date;
  lat?: number;
  lng?: number;
  code?: string;
}
