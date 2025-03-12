import { type FunctionComponent } from 'preact';
import { Route, Router, Switch } from 'wouter';
import { PAGES_LIST } from '@/utils/routing';
import { HomeLayout } from '@/pages/home/home.layout';
import { AWS_AMPLIFY_SETTINGS } from './aws-exports';
import { AuthAmplifyProps } from './utils/types/auth.interface';
import { DashboardLayout } from './pages/dashboard/dashboard.layout';
import { WebSocketProvider } from './utils/socket';
import { Amplify } from 'aws-amplify';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { CustomLoginPage } from '@/components/compose/login/custom';

Amplify.configure(AWS_AMPLIFY_SETTINGS);

// Componente AuthenticatedContent que decide qué renderizar basado en el estado de autenticación
const AuthenticatedContent = ({ props }: any) => {
  const { route, signOut } = useAuthenticator((context) => [
    context.route,
    context.signOut,
  ]);

  if (route !== 'authenticated') {
    return <CustomLoginPage />;
  }

  return (
    <WebSocketProvider>
      <DashboardLayout {...props} signOut={signOut} />
    </WebSocketProvider>
  );
};

export const App: FunctionComponent<AuthAmplifyProps> = (props) => {
  return (
    <section className='h-screen'>
      <Switch>
        <Route path={PAGES_LIST.HOME} component={HomeLayout} />
        <Router base={PAGES_LIST.DASHBOARD}>
          <div className='w-full h-full'>
            {/*
                Usamos Authenticator como proveedor de contexto sin UI por defecto
                y dentro controlamos qué renderizar con nuestro componente personalizado
              */}
            <Authenticator.Provider>
              <AuthenticatedContent props={props} />
            </Authenticator.Provider>
          </div>
        </Router>
      </Switch>
    </section>
  );
};

export async function getStaticProps() {
  return {
    props: {
      isPassedToWithAuthenticator: true,
    },
  };
}
