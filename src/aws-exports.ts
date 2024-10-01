import { ResourcesConfig } from 'aws-amplify';

export const AWS_AMPLIFY_SETTINGS: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_AWS_COGNITO_USER_POOL_ID || '',
      userPoolClientId: import.meta.env.VITE_AWS_COGNITO_CLIENT_ID || '',
      signUpVerificationMethod: 'code' as 'code' | 'link',
      loginWith: {
        oauth: {
          domain: import.meta.env.VITE_AWS_OAUTH_DOMAIN || '',
          scopes: [
            'openid',
            'email',
            'phone',
            'profile',
            'aws.cognito.signin.user.admin',
          ],
          redirectSignIn: ['http://localhost:3050/dashboard'],
          redirectSignOut: ['http://localhost:3050/'],
          responseType: 'code',
        },
        username: true,
        email: false,
        phone: false,
      },
    },
  },
};
