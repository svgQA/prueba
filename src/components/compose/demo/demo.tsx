import React from 'react';
import { useTranslation } from 'react-i18next';
import { Logo } from '@/components/common/logo/logo';
import './styles.css';
import { Form, Field } from 'react-final-form';
import { Input } from '@/components/common/input/input';
import { TextArea } from '@/components/common/text.area/text.area';
import { required } from '@/utils/utilities';
import { TenantService } from '@/services/general/tenant';
import { ToastManager } from '@/utils/toast/toast-manager';

interface DemoFormData {
  name: string;
  surname: string;
  email: string;
  phone: string;
  company_name: string;
  company_description: string;
  manager_name: string;
  manager_surname: string;
  manager_email: string;
  manager_phone: string;
}

interface CustomDemoContainerProps {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
  containerClassName?: string;
  formClassName?: string;
}

const CustomDemoContainer = ({
  children,
  title,
  subtitle,
  showLogo = true,
  containerClassName = '',
  formClassName = '',
}: CustomDemoContainerProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={`w-full min-h-screen flex flex-col md:flex-row bg-gradient-to-r from-cyan-500 to-emerald-400 items-center justify-center p-3 sm:p-4 md:p-8 overflow-x-hidden ${containerClassName}`}
    >
      <div className='flex items-center md:items-start w-full md:w-7/12 flex-col p-2 md:p-5 md:pl-14 mb-4 md:mb-0 text-center md:text-left'>
        <div className='max-w-3xl text-white w-full'>
          {showLogo && (
            <div className='flex justify-center md:justify-start mb-3 md:mb-6 text-3xl'>
              <Logo title='Tryvoo' slogan='' />
            </div>
          )}
          <h1 className='text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-2 md:mb-4 w-full leading-tight'>
            {title || t('i_demo_title')}
          </h1>
          <h4 className='text-white sm:text-xl md:text-xl lg:text-2xl leading-relaxed opacity-90 font-semibold max-w-2xl mx-auto md:mx-0'>
            {subtitle || t('i_demo_subtitle')}
          </h4>
        </div>
      </div>

      <div
        className={`bg-white flex items-center justify-center px-6 py-6 sm:px-8 sm:py-8 rounded-lg w-full md:w-[600px] ${formClassName}`}
      >
        <div className='w-full h-full flex items-center justify-center'>
          {children}
        </div>
      </div>
    </div>
  );
};

export const DemoForm = () => {
  const { t } = useTranslation();

  const onSubmit = async (model: Record<string, any>, form: any) => {
    
    const data = {
      ...model,
      phone:  `+57${model.phone}`,
    };
    const response = await TenantService.create_demo(data as DemoFormData);
    if (response.getStatus()) {
      ToastManager.success(
        'Demo creado correctamente, se enviará un correo a los administradores para su aprobación'
      );
      form.restart();
    }
  };

  return (
    <CustomDemoContainer
      title={t('i_demo_title')}
      subtitle={t('i_demo_subtitle')}
    >
      <div className='w-full px-4 sm:px-6'>
        {/* <div className='text-center mb-4'>
          <h3 className='text-cyan-500 text-xl font-bold'>
            {t('i_demo_title')}
          </h3>
        </div> */}

        <Form
          onSubmit={(values, form) => onSubmit(values, form)}
          validate={(values) => {
            const errors: Partial<DemoFormData> = {};
            if (!values.name) errors.name = 'field_required';
            if (!values.email) errors.email = 'field_required';
            if (!values.phone) errors.phone = 'field_required';
            if (!values.company_name) errors.company_name = 'field_required';
            if (!values.company_description)
              errors.company_description = 'field_required';
            return errors;
          }}
          render={({ handleSubmit, submitting }) => (
            <form onSubmit={handleSubmit} className='space-y-4' id='form-demo'>
              {/* Información Personal */}
              <div className='space-y-3'>
                <h4 className='text-cyan-500 text-xl font-bold'>
                  Información Personal
                </h4>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  <Field<string> name='name' validate={required}>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        type='text'
                        placeholder='Nombre'
                        label='Nombre*'
                        meta={meta}
                      />
                    )}
                  </Field>

                  <Field<string> name='surname'>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        type='text'
                        placeholder='Apellido'
                        label='Apellido'
                        meta={meta}
                      />
                    )}
                  </Field>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  <Field<string> name='email' validate={required}>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        type='email'
                        placeholder='Email'
                        label='Email*'
                        meta={meta}
                      />
                    )}
                  </Field>

                  <Field<string> name='phone' validate={required}>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        type='tel'
                        placeholder='Teléfono'
                        label='Teléfono*'
                        meta={meta}
                      />
                    )}
                  </Field>
                </div>
              </div>

              {/* Información de la Empresa */}
              <div className='space-y-3'>
                <h4 className='text-cyan-500 text-xl font-bold'>
                  Información de la Empresa
                </h4>

                <Field<string> name='company_name' validate={required}>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      type='text'
                      placeholder='Nombre de la Empresa'
                      label='Nombre de la Empresa*'
                      meta={meta}
                    />
                  )}
                </Field>

                <Field<string> name='company_description' validate={required}>
                  {({ input, meta }) => (
                    <TextArea
                      {...input}
                      min='3'
                      max='500'
                      placeholder='Descripción de la Empresa'
                      label='Descripción de la Empresa*'
                      type='text'
                      meta={meta}
                    />
                  )}
                </Field>
              </div>

              {/* Información del Gerente */}
              <div className='space-y-3'>
                <h4 className='text-cyan-500 text-xl font-bold'>
                  Información del Gerente
                </h4>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  <Field<string> name='manager_name'>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        type='text'
                        placeholder='Nombre del Gerente'
                        label='Nombre del Gerente'
                        meta={meta}
                      />
                    )}
                  </Field>

                  <Field<string> name='manager_surname'>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        type='text'
                        placeholder='Apellido del Gerente'
                        label='Apellido del Gerente'
                        meta={meta}
                      />
                    )}
                  </Field>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  <Field<string> name='manager_email'>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        type='email'
                        placeholder='Email del Gerente'
                        label='Email del Gerente'
                        meta={meta}
                      />
                    )}
                  </Field>

                  <Field<string> name='manager_phone'>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        type='tel'
                        placeholder='Teléfono del Gerente'
                        label='Teléfono del Gerente'
                        meta={meta}
                      />
                    )}
                  </Field>
                </div>
              </div>

              <button
                type='submit'
                className='w-full mt-4 px-4 py-2 bg-cyan-500 text-white font-medium rounded-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors duration-200'
                disabled={submitting}
              >
                {submitting ? 'Enviando...' : 'Solicitar Demo'}
              </button>
            </form>
          )}
        />
        <div className='text-center mt-4 text-xs text-gray-500'>
          © {new Date().getFullYear()} Tryvoo
        </div>
      </div>
    </CustomDemoContainer>
  );
};

export { CustomDemoContainer };
