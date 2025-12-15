import { StatusThresholds } from './types';

export const defaultThresholds: StatusThresholds = {
  success: 90,
  neutral: 70,
};

export const roundThresholds: StatusThresholds = {
  success: 10,
  neutral: 25,
};

export const riskThresholds: StatusThresholds = {
  success: 5,
  neutral: 15,
};
