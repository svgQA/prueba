import { IPagination } from '@/types';

export interface IPaginationPlace extends IPagination {
  contractId?: number;
  projectId?: number;
}

export interface IPaginationRound extends IPagination {
  placeId?: number;
}

export interface IPagintationGantt extends IPagination {
  mode?: ViewMode;
  // start: string;
  // end?: string;
}

export interface IReplicateShift {
  date: string;
  id: number | string;
}
