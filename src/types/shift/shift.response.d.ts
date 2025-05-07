export interface IDepartmentResponse {
  id: number;
  name: string;
  code: string;
}

export interface IMunicipalityResponse {
  id: number;
  name: string;
  code: string;
}

export interface IProjectMetricsResponse {
  completedShifts: number;
  completionPercentage: number;
  totalHours: number;
  totalShifts: number;
}
