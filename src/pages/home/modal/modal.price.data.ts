// planData.ts

export interface PlanData {
  id: string;
  title: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  semiannualPrice?: number;
}

export const plans: PlanData[] = [
  {
    id: '1',
    title: 'Plan Básico',
    description:
      'Ideal para pequeñas empresas. Incluye funcionalidades esenciales para crecer',
    monthlyPrice: 29.99,
    annualPrice: 299.99,
    semiannualPrice: 169.99,
  },
  {
    id: '2',
    title: 'Plan Pro',
    description:
      'Para empresas en crecimiento. Características avanzadas para optimizar tus operaciones.',
    monthlyPrice: 59.99,
    annualPrice: 599.99,
    semiannualPrice: 329.99,
  },
  {
    id: '3',
    title: 'Plan Enterprise',
    description:
      'Solución completa para grandes empresas. Personalización total y soporte prioritario incluido.',
    monthlyPrice: 99.99,
    annualPrice: 999.99,
    semiannualPrice: 549.99,
  },
];
