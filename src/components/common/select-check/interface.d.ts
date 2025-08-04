import { IOption } from "../smart-selector/smart-select";

export interface IOptionCheck extends IOption {
    icon: string;
    color?: string;
}

export interface SelectCheckProps {
    input: SelectCheckInputProps;
    options: IOptionCheck[];
    label?: string;
    loading?: boolean;
}