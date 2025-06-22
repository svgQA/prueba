import { type FunctionComponent } from 'preact';
import { Route, Router, Switch } from 'wouter';
import { PAGES_LIST } from '@/utils/routing';
import { HomeLayout } from '@/pages/home/home.layout';
import DemoPage from '@/pages/demo';
import { AWS_AMPLIFY_SETTINGS } from './aws-exports';
import { AuthAmplifyProps } from './utils/types/auth.interface';
import { DashboardLayout } from './pages/dashboard/dashboard.layout';
import { Amplify } from 'aws-amplify';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { CustomLoginPage } from '@/components/compose/login/custom';
import { getIsInErrorState } from './store/signals/service/service.signals';
import { ModalBaseService } from './components/compose/base-service/base-service';
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
  return (
    <section>
      <Switch>
        <Route path={PAGES_LIST.HOME} component={HomeLayout} />
        <Route path={PAGES_LIST.DEMO} component={DemoPage} />
        <Router base={PAGES_LIST.DASHBOARD}>
          <div className='w-full h-full'>
            <Authenticator.Provider>
              <AuthenticatedContent props={props} />
            </Authenticator.Provider>
          </div>
        </Router>
      </Switch>
      <ModalBaseService isOpen={getIsInErrorState()} />
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
