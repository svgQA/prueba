import { type FunctionComponent } from 'preact';
import { Route, Router, Switch } from 'wouter';
import { PAGES_LIST } from '@/utils/routing';
import { HomeLayout } from '@/pages/home/home.layout';
import { AWS_AMPLIFY_SETTINGS } from './aws-exports';
import { AuthAmplifyProps } from './utils/types/auth.interface';
import { DashboardLayout } from './pages/dashboard/dashboard.layout';
import { Amplify } from 'aws-amplify';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { CustomLoginPage } from '@/components/compose/login/custom';
import { hasUserTenant, useUserStore } from './store/slices';
import { BaseService } from './utils/network';
import { closeLoading, openLoading } from './store/signals/modals';
import { useEffect } from 'preact/hooks';

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

  return <DashboardLayout {...props} signOut={signOut} />;
};

export const App: FunctionComponent<AuthAmplifyProps> = (props) => {
  const {
    getTenant,
    getToken,
    getCompanyId,
    setToken,
    setCognito,
    setTenant,
    setUser,
  } = useUserStore();

  useEffect(() => {
    BaseService.setLoading(openLoading, closeLoading);
    BaseService.setUser(getTenant, getToken, getCompanyId);
    validateUser();
    console.log('validateUser', 'Mierda .com');
  }, []);

  const validateUser = async () => {
    await hasUserTenant(setToken, setCognito, setTenant, setUser);
  };

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
