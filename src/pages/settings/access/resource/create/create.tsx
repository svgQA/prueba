import { FunctionComponent } from 'preact';
import { Section } from '@/components/common/section/section';
import { useSignal } from '@preact/signals';

export const CreateResourceSettingPage: FunctionComponent = () => {
  const loading = useSignal<boolean>(false);
  return <Section loading={loading.value}></Section>;
};
