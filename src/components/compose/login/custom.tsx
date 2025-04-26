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
    <div className='w-full h-screen flex bg-gradient-to-r from-cyan-500 to-emerald-400 items-center'>
      <div className='flex items-start w-7/12 flex-col p-5 pl-14'>
        <div className='max-w-3xl text-white !text-left w-full'>
          <Logo title='' slogan='' />
          <h1 className='text-4xl font-bold mb-3 w-full'>
            {t('login.welcome')}
          </h1>
          <h4 className='text-lg leading-relaxed opacity-90 font-semibold'>
            {t('login.slogan')}
          </h4>
        </div>
        <div className='flex items-center justify-center gap-3 mt-6 bg-white p-5 rounded-tr-3xl rounded-bl-3xl bg-opacity-10'>
          <div className='w-48 h-20 bg-white rounded-es-3xl bg-opacity-20 p-3'>
            <div className='h-3 w-20 bg-white bg-opacity-50 mb-2 rounded-full'></div>
            <div className='h-8 w-32 bg-white bg-opacity-50 rounded-lg'></div>
          </div>
          <div className='w-48 h-20 bg-white rounded-se-3xl bg-opacity-20 p-3'>
            <div className='h-3 w-20 bg-white bg-opacity-50 mb-2 rounded-full'></div>
            <div className='h-8 w-32 bg-white bg-opacity-50 rounded-lg'></div>
          </div>
        </div>
      </div>

      <div className='bg-white flex items-center px-4 py-6 rounded-lg min-w-96 min-h-96'>
        <div className='w-full max-w-md'>{children}</div>
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
        <h3 className='mb-5 text-2xl my-3'>{t('login.signIn')}</h3>
      </div>
    );
  },
  Footer() {
    return (
      <div className='text-center' style={{ margin: '1rem 0' }}>
        <p>© {new Date().getFullYear()} Tryvoo</p>
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
            className='text-sm font-normal border-0 outline-none focus:outline-none hover:border-0 active:border-0'
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
      >
        {(_) => null}
      </Authenticator>
    </CustomLoginContainer>
  );
};
