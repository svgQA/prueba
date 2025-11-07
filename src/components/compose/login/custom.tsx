import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { useLocation } from 'wouter';
import { PAGES_LIST } from '@/utils/routing';
import { Logo } from '@/components/common/logo/logo';
import '@aws-amplify/ui-react/styles.css';
import './styles.css';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
// import i18n from '@/i18n';

interface CustomLoginContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
  showSlogan?: boolean;
  showDecoration?: boolean;
  containerClassName?: string;
  formClassName?: string;
}

const CustomLoginContainer = ({
  children,
  title,
  subtitle,
  showLogo = true,
  showSlogan = true,
  showDecoration = true,
  containerClassName = '',
  formClassName = '',
}: CustomLoginContainerProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={`w-full min-h-screen flex flex-col md:flex-row bg-gradient-to-r from-cyan-500 to-emerald-400 items-center justify-center p-3 sm:p-4 md:p-8 overflow-x-hidden ${containerClassName}`}
    >
      <div className='flex items-center md:items-start w-full md:w-7/12 flex-col p-2 md:p-5 md:pl-14 mb-4 md:mb-0 text-center md:text-left'>
        <div className='max-w-3xl text-white w-full'>
          {showLogo && (
            <div className='flex justify-center md:justify-start mb-3 md:mb-6'>
              <Logo title='' slogan='' />
            </div>
          )}
          <h1 className='text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-2 md:mb-4 w-full leading-tight'>
            {title || t('i_welcome')}
          </h1>
          {showSlogan && (
            <h4 className='text-base sm:text-lg md:text-2xl lg:text-3xl leading-relaxed opacity-90 font-semibold max-w-2xl mx-auto md:mx-0'>
              {subtitle || t('i_slogan')}
            </h4>
          )}
        </div>
        {showDecoration && (
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
        )}
      </div>

      <div
        className={`bg-white flex items-center justify-center px-3 py-4 sm:px-4 sm:py-6 rounded-lg w-full md:w-[400px] md:min-h-[400px] ${formClassName}`}
      >
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
        <h3 className='mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl my-2 sm:my-3 text-ternary'>
          {t('i_signIn')}
        </h3>
      </div>
    );
  },
  Footer() {
    return (
      <div className='text-center' style={{ margin: '0.75rem 0' }}>
        <p className='text-xs sm:text-sm md:text-base text-ternary'>
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
      /*  const { t } = useTranslation();
      return (
        <div className='text-center'>
          <button
            onClick={() => {}}
            className='text-xs sm:text-sm font-normal border-0 outline-none focus:outline-none hover:border-0 active:border-0 text-ternary'
          >
            {t('i_forgotPassword')}
          </button>
        </div>
      );*/
      return null;
    },
  },
};

export const CustomLoginPage = () => {
  const [_, navigate] = useLocation();
  const { route } = useAuthenticator((context) => [context.route]);
  // const { t } = useTranslation();

  useEffect(() => {
    const handleFormSubmit = (event: Event) => {
      const target = event.target as HTMLFormElement;

      if (target && target.tagName === 'FORM') {
        const passwordInput = target.querySelector(
          'input[name="password"]'
        ) as HTMLInputElement;

        if (passwordInput) {
          passwordInput.value = passwordInput.value.trim();
        }
      }
    };
    document.addEventListener('submit', handleFormSubmit, true);
    return () => {
      document.removeEventListener('submit', handleFormSubmit, true);
    };
  }, []);

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
        formFields={{
          signIn: {
            username: {
              // label: t('h_email'),
              // placeholder: t('p_email'),
              label: 'Correo electrónico',
              placeholder: 'Introduce tu correo electrónico...',
            },
            password: {
              // label: t('h_password'),
              // placeholder: t('p_enter_password'),
              label: 'Contraseña',
              placeholder: 'Introduce tu contraseña...',
            },
          },
        }}
        // i18nIsDynamicList={true}
        // key={i18n.language}
      />
    </CustomLoginContainer>
  );
};

// Export the container component for reuse
export { CustomLoginContainer };
