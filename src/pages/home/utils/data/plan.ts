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
    pricingKey: 'i_plans_free_pricing',
    nameKey: 'i_plans_free_name',
    actionKey: 'i_plans_free_action',
    subtitleKey: 'i_plans_free_subtitle',
    bgColor: 'primary',
    border: 'border-2 border-primary',
    optionsKeys: [
      'i_plans_free_option1',
      'i_plans_free_option2',
      'i_plans_free_option3',
      'i_plans_free_option4',
      'i_plans_free_option5',
    ],
  },
  {
    pricingKey: 'i_plans_enterprise_pricing',
    nameKey: 'i_plans_enterprise_name',
    actionKey: 'i_plans_enterprise_action',
    subtitleKey: 'i_plans_enterprise_subtitle',
    bgColor: 'blue-dark',
    optionsKeys: [
      'i_plans_enterprise_option1',
      'i_plans_enterprise_option2',
      'i_plans_enterprise_option3',
      'i_plans_enterprise_option4',
      'i_plans_enterprise_option5',
      'i_plans_enterprise_option6',
    ],
  },
  {
    pricingKey: 'i_plans_premium_pricing',
    nameKey: 'i_plans_premium_name',
    actionKey: 'i_plans_premium_action',
    subtitleKey: 'i_plans_premium_subtitle',
    bgColor: 'blue-dark',
    inverse: true,
    optionsKeys: [
      'i_plans_premium_option1',
      'i_plans_premium_option2',
      'i_plans_premium_option3',
      'i_plans_premium_option4',
      'i_plans_premium_option5',
      'i_plans_premium_option6',
      'i_plans_premium_option7',
    ],
  },
];
