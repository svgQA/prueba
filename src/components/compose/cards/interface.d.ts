import { ICardProps } from '@/components/common/card/interface';
import { type IComponentProps } from '@/components/utils/interface';
import { type PropsWithChildren } from 'preact/compat';

export interface IInvoiceCardProps extends ICardProps {
  total: number;
  currency: 'COP' | 'USD' | 'EUR';
  active?: boolean;
}

export interface ICreditCardProps extends ICardProps {
  active?: boolean;
  number?: string;
  onClick?: (value: boolean) => void;
}
