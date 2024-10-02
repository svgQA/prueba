import { computed, signal } from '@preact/signals';
import { IOnboardingModel } from './interfaces';

const OnBoardingInitialState: IOnboardingModel = {
  adminName: '',
  adminPhone: '',
  adminAddress: '',
  companyName: '',
  companyNIT: '',
  companyLocation: '',
  companyIndustry: '',
  serviceOfInterest: '',
  employeeCount: '',
};

export const onBoardingState = signal<IOnboardingModel>(OnBoardingInitialState);
export const onBoardingModel = computed(() => onBoardingState.value);
export const onBoardingClean = () => {
  onBoardingState.value = OnBoardingInitialState;
};

const showOnBoardingModal = signal<boolean>(false);

export const getStatusOnBoardingModal = computed(
  () => showOnBoardingModal.value
);

export const closeOnBoardingModal = () => (showOnBoardingModal.value = true);
export const openOnBoardingModal = () => (showOnBoardingModal.value = false);
export const toggleOnBoardingModal = () =>
  (showOnBoardingModal.value = !showOnBoardingModal.value);
