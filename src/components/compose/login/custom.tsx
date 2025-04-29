import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { useLocation } from 'wouter';
import { PAGES_LIST } from '@/utils/routing';
import { Logo } from '@/components/common/logo/logo';
import '@aws-amplify/ui-react/styles.css';
import './styles.css';
import { useTranslation } from 'react-i18next';

const CustomLoginContainer = ({ children }: any) => {
  const { t } = useTranslation();

  return (
    <div className='w-full min-h-screen flex flex-col md:flex-row bg-gradient-to-r from-cyan-500 to-emerald-400 items-center justify-center p-3 sm:p-4 md:p-8 overflow-x-hidden'>
      <div className='flex items-center md:items-start w-full md:w-7/12 flex-col p-2 md:p-5 md:pl-14 mb-4 md:mb-0 text-center md:text-left'>
        <div className='max-w-3xl text-white w-full'>
          <div className='flex justify-center md:justify-start mb-3 md:mb-6'>
            <Logo title='' slogan='' />
          </div>
          <h1 className='text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-2 md:mb-4 w-full leading-tight'>
            {t('login.signIn')}
          </h1>
          <h4 className='text-base sm:text-lg md:text-2xl lg:text-3xl leading-relaxed opacity-90 font-semibold max-w-2xl mx-auto md:mx-0'>
            {t('login.slogan')}
          </h4>
        </div>
        <div className='flex items-center justify-center gap-2 sm:gap-3 mt-4 md:mt-8 bg-white p-2 sm:p-4 md:p-5 rounded-tr-3xl rounded-bl-3xl bg-opacity-10 w-full max-w-md mx-auto md:mx-0'>
          <div className='w-24 sm:w-32 md:w-48 h-14 sm:h-16 md:h-20 bg-white rounded-es-3xl bg-opacity-20 p-2 sm:p-3'>
            <div className='h-2 sm:h-3 w-12 sm:w-16 md:w-20 bg-white bg-opacity-50 mb-1 sm:mb-2 rounded-full'></div>
            <div className='h-5 sm:h-6 md:h-8 w-20 sm:w-24 md:w-32 bg-white bg-opacity-50 rounded-lg'></div>
          </div>
          <div className='w-24 sm:w-32 md:w-48 h-14 sm:h-16 md:h-20 bg-white rounded-se-3xl bg-opacity-20 p-2 sm:p-3'>
            <div className='h-2 sm:h-3 w-12 sm:w-16 md:w-20 bg-white bg-opacity-50 mb-1 sm:mb-2 rounded-full'></div>
            <div className='h-5 sm:h-6 md:h-8 w-20 sm:w-24 md:w-32 bg-white bg-opacity-50 rounded-lg'></div>
          </div>
        </div>
      </div>

      <div className='bg-white flex items-center justify-center px-3 py-4 sm:px-4 sm:py-6 rounded-lg w-full md:w-[400px] md:h-[500px] md:min-h-[500px] md:max-h-[500px] mt-4 md:mt-0'>
        <div className='w-full h-full flex items-center justify-center'>
          {children}
        </div>
      </div>
    </div>
  );
};

const components = {
  Header() {
    const { t } = useTranslation();
    return (
      <div className='text-center flex flex-col items-center'>
        <Logo title='Tryvoo' slogan='' color='text-primary' />
        <h3 className='mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl my-2 sm:my-3'>
          {t('login.signIn')}
        </h3>
      </div>
    );
  },
  Footer() {
    return (
      <div className='text-center' style={{ margin: '0.75rem 0' }}>
        <p className='text-xs sm:text-sm md:text-base'>
          © {new Date().getFullYear()} Tryvoo
        </p>
      </div>
    );
  },
  SignIn: {
    Header() {
      return null;
    },
    Footer() {
      const { t } = useTranslation();
      return (
        <div className='text-center'>
          <button
            onClick={() => console.log(t('login.forgotPassword'))}
            className='text-xs sm:text-sm font-normal border-0 outline-none focus:outline-none hover:border-0 active:border-0'
          >
            {t('login.forgotPassword')}
          </button>
        </div>
      );
    },
  },
};

export const CustomLoginPage = () => {
  const [_, navigate] = useLocation();
  const { route } = useAuthenticator((context) => [context.route]);

  if (route === 'authenticated') {
    navigate(PAGES_LIST.DASHBOARD);
    return null;
  }

  return (
    <CustomLoginContainer>
      <Authenticator
        hideSignUp={true}
        components={components}
        initialState='signIn'
        loginMechanisms={['email']}
        signUpAttributes={[]}
        services={{
          async validateCustomSignUp(): Promise<{ errors: string[] }> {
            return { errors: [] };
          },
        }}
      />
    </CustomLoginContainer>
  );
};
