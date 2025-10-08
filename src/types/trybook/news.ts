import { IOption } from "@/components/common/smart-selector/smart-select";
import { IPresignedRequest } from "../file";

export interface INews {
  id?: number;
  name: string;
  description: string;
  place?: IOption;
  resource?: IPresignedRequest[];
  keylinks?: string[];
}
