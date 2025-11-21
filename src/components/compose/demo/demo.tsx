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
      className={`relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#0b1f33] via-[#102a44] to-[#0b1f33] p-4 sm:p-6 md:p-10 ${containerClassName}`}
    >
      <div className='pointer-events-none absolute inset-0 opacity-60'>
        <div className='absolute -left-12 -top-24 h-52 w-52 rounded-full bg-primary/25 blur-3xl' />
        <div className='absolute bottom-0 left-10 h-48 w-48 rounded-full bg-emerald-300/25 blur-3xl' />
        <div className='absolute right-[-6%] top-14 h-80 w-80 rounded-full bg-cyan-400/25 blur-[110px]' />
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(255,255,255,0.05),transparent_36%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.15),transparent_30%)]' />
      </div>

      <div className='relative z-10 flex w-full max-w-6xl flex-col gap-10 rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl ring-1 ring-white/10 backdrop-blur-2xl md:flex-row md:p-10'>
        <div className='flex w-full flex-col justify-center gap-6 text-center text-white md:w-7/12 md:text-left'>
          <div className='flex flex-col gap-4'>
            {showLogo && (
              <div className='flex items-center justify-center md:justify-start'>
                <Logo title='Tryvoo' slogan='' />
              </div>
            )}
            <div className='mx-auto flex max-w-xl items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/80 md:mx-0'>
              <span className='inline-block h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.8)]'></span>
              Demo exclusiva
            </div>
          </div>

          <div className='space-y-4'>
            <h1 className='text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl lg:text-6xl'>
              {title || t('i_demo_title')}
            </h1>
            <h4 className='mx-auto max-w-2xl text-lg leading-relaxed text-white/80 md:mx-0 md:text-xl'>
              {subtitle || t('i_demo_subtitle')}
            </h4>
          </div>

          <div className='grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 text-left shadow-lg backdrop-blur-xl sm:grid-cols-2'>
            <div className='flex items-center gap-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10'>
              <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/25 text-white'>
                🚀
              </div>
              <div>
                <p className='text-sm font-semibold text-white'>Setup guiado</p>
                <p className='text-xs text-white/70'>Acompañamiento para configurar tu operación.</p>
              </div>
            </div>
            <div className='flex items-center gap-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10'>
              <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/20 text-emerald-200'>
                📊
              </div>
              <div>
                <p className='text-sm font-semibold text-white'>Indicadores clave</p>
                <p className='text-xs text-white/70'>Métricas claras para tus decisiones.</p>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`relative w-full md:w-[560px] ${formClassName}`}
        >
          <div className='absolute inset-0 -z-10 rounded-[28px] bg-gradient-to-br from-white/25 via-white/10 to-transparent opacity-70 blur-2xl' />
          <div className='relative overflow-hidden rounded-[28px] border border-white/20 bg-white/85 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8'>
            <div className='absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-cyan-300 to-emerald-300' />
            <div className='w-full h-full flex items-center justify-center'>
              {children}
            </div>
          </div>
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
      phone: `+57${model.phone}`,
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
