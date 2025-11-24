import { Section } from '@/components/common/section/section';
import { FunctionComponent } from 'preact';
import { Form } from 'react-final-form';
import { ISecuritySetting } from '@/types/settings';
import { StatusButton } from '../../components/custom.button';

export const SSecuritySettingPage: FunctionComponent = () => {
  const onSubmit = (model: any) => {
    console.log(model);
  };

  return (
    <Section>
      <div className='py-5 border-b border-b-light-dark dark:border-b-dark-light'>
        <Form<ISecuritySetting>
          onSubmit={onSubmit}
          render={({ handleSubmit, form, submitting, pristine }) => (
            <form
              onSubmit={handleSubmit}
              className='space-y-6 relative'
              id='form-settings-general'
            >
              <h2 className='text-2xl font-bold'>Configuración de Seguridad</h2>
              <div className='grid grid-cols-2 gap-4'></div>
              <StatusButton
                onClickClean={() => {
                  form.reset();
                }}
                top={false}
                submitting={submitting}
                pristine={pristine}
                form='form-settings-general'
              />
            </form>
          )}
        />
      </div>
    </Section>
  );
};
