import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { useLocation } from 'wouter';
import { PAGES_LIST } from '@/utils/routing';
import { Logo } from '@/components/common/logo/logo';

import './styles.css';

const CustomLoginContainer = ({ children }: any) => {
  return (
    <div className='w-full h-screen flex'>
      <div className='w-4/6 bg-gradient-to-r from-cyan-500 to-emerald-400 flex items-center justify-center'>
        <div className='p-12 max-w-3xl text-white'>
          <Logo title='Tryvoo' slogan='' />
          <h1 className='text-4xl font-bold mb-6'>
            Bienvenido a Nuestra Plataforma
          </h1>
          <p className='text-xl leading-relaxed opacity-90'>
            Una solución integral para la gestión de sus procesos empresariales,
            diseñada para optimizar la productividad y mejorar los resultados.
          </p>
        </div>
      </div>

      <div className='w-2/6 flex items-center justify-center bg-white shadow-lg'>
        <div className='w-full max-w-md'>{children}</div>
      </div>
    </div>
  );
};

const components = {
  Header() {
    return (
      <div className='text-center'>
        <Logo title='Tryvoo' slogan='' />
        <h3 class='mb-5 text-2xl'>Iniciar sesión</h3>
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
      return (
        <div className='text-center'>
          <button
            onClick={() => console.log('¿Olvidó su contraseña?')}
            className='text-sm font-normal border-0 outline-none focus:outline-none hover:border-0 active:border-0'
          >
            ¿Olvidó su contraseña?
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
        // socialProviders={['google']}
      >
        {(_) => null}
      </Authenticator>
    </CustomLoginContainer>
  );
};
