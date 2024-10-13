import { WithAuthenticatorProps } from '@aws-amplify/ui-react';

export interface AuthAmplifyProps extends WithAuthenticatorProps {
  isPassedToWithAuthenticator: boolean;
}
