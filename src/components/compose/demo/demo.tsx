import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Logo } from '@/components/common/logo/logo';
import './styles.css';

interface DemoFormData {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  date: string;
  time: string;
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
        className={`bg-white flex items-center justify-center px-3 py-4 sm:px-4 sm:py-6 rounded-lg w-full md:w-[400px] md:min-h-[500px] ${formClassName}`}
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
  const [formData, setFormData] = useState<DemoFormData>({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    date: '',
    time: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar la solicitud de demo
    setFormData({
      fullName: '',
      company: '',
      email: '',
      phone: '',
      date: '',
      time: '',
    });
  };

  return (
    <CustomDemoContainer
      title={t('i_demo_title')}
      subtitle={t('i_demo_subtitle')}
    >
      <div className='w-full px-2 sm:px-4'>
        <div className='text-center mb-4'>
          <h3 className='text-cyan-500 text-xl font-bold'>
            {t('i_demo_title')}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <label
              htmlFor='fullName'
              className='block text-sm font-medium text-gray-700'
            >
              {t('l_name')}
            </label>
            <input
              type='text'
              id='fullName'
              name='fullName'
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder={t('p_name')}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
              required
            />
          </div>

          <div className='space-y-2'>
            <label
              htmlFor='company'
              className='block text-sm font-medium text-gray-700'
            >
              {t('l_company')}
            </label>
            <input
              type='text'
              id='company'
              name='company'
              value={formData.company}
              onChange={handleInputChange}
              placeholder={t('p_company')}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
              required
            />
          </div>

          <div className='space-y-2'>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700'
            >
              {t('l_email')}
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t('p_email')}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
              required
            />
          </div>

          <div className='space-y-2'>
            <label
              htmlFor='phone'
              className='block text-sm font-medium text-gray-700'
            >
              {t('l_phone')}
            </label>
            <input
              type='tel'
              id='phone'
              name='phone'
              value={formData.phone}
              onChange={handleInputChange}
              placeholder={t('p_phone')}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
              required
            />
          </div>

          <div className='flex space-x-4'>
            <div className='w-1/2 space-y-2'>
              <label
                htmlFor='date'
                className='block text-sm font-medium text-gray-700'
              >
                {t('l_date')}
              </label>
              <input
                type='date'
                id='date'
                name='date'
                value={formData.date}
                onChange={handleInputChange}
                placeholder={t('p_date')}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
                required
              />
            </div>
            <div className='w-1/2 space-y-2'>
              <label
                htmlFor='time'
                className='block text-sm font-medium text-gray-700'
              >
                {t('l_time')}
              </label>
              <input
                type='time'
                id='time'
                name='time'
                value={formData.time}
                onChange={handleInputChange}
                placeholder={t('p_time')}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
                required
              />
            </div>
          </div>

          <button
            type='submit'
            className='w-full mt-4 px-4 py-3 bg-cyan-500 text-white font-medium rounded-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500'
          >
            {t('i_demo_title')}
          </button>
        </form>

        <div className='text-center mt-4 text-xs text-gray-500'>
          © {new Date().getFullYear()} Tryvoo
        </div>
      </div>
    </CustomDemoContainer>
  );
};

export { CustomDemoContainer };
