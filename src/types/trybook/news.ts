import { IOption } from "@/components/common/smart-selector/smart-select";

export interface INews {
  id?: number;
  name: string;
  description: string;
  place?: IOption;
}
