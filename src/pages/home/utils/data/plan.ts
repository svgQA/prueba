export interface IPlanData {
  pricingKey: string;
  nameKey: string;
  actionKey: string;
  subtitleKey: string;
  optionsKeys: string[];
  bgColor: string;
  inverse?: boolean;
  border?: string;
}

export const plans_data: IPlanData[] = [
  {
    pricingKey: 'plans.free.pricing',
    nameKey: 'plans.free.name',
    actionKey: 'plans.free.action',
    subtitleKey: 'plans.free.subtitle',
    bgColor: 'primary',
    border: 'border-2 border-primary',
    optionsKeys: [
      'plans.free.options.option1',
      'plans.free.options.option2',
      'plans.free.options.option3',
      'plans.free.options.option4',
      'plans.free.options.option5',
    ],
  },
  {
    pricingKey: 'plans.enterprise.pricing',
    nameKey: 'plans.enterprise.name',
    actionKey: 'plans.enterprise.action',
    subtitleKey: 'plans.enterprise.subtitle',
    bgColor: 'blue-dark',
    optionsKeys: [
      'plans.enterprise.options.option1',
      'plans.enterprise.options.option2',
      'plans.enterprise.options.option3',
      'plans.enterprise.options.option4',
      'plans.enterprise.options.option5',
      'plans.enterprise.options.option6',
    ],
  },
  {
    pricingKey: 'plans.premium.pricing',
    nameKey: 'plans.premium.name',
    actionKey: 'plans.premium.action',
    subtitleKey: 'plans.premium.subtitle',
    bgColor: 'blue-dark',
    inverse: true,
    optionsKeys: [
      'plans.premium.options.option1',
      'plans.premium.options.option2',
      'plans.premium.options.option3',
      'plans.premium.options.option4',
      'plans.premium.options.option5',
      'plans.premium.options.option6',
      'plans.premium.options.option7',
    ],
  },
];
