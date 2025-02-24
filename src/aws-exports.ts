import { ResourcesConfig } from '@aws-amplify/core';
import {
  aws_cognito_client_id,
  aws_cognito_user_pool,
  aws_oauth_domain,
} from './env.config';

export const AWS_AMPLIFY_SETTINGS: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: aws_cognito_user_pool,
      userPoolClientId: aws_cognito_client_id,
      signUpVerificationMethod: 'code' as 'code' | 'link',
      loginWith: {
        username: true,
        email: false,
        phone: false,
        oauth: {
          domain: aws_oauth_domain,
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
      },
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: true,
      },
    },
  },
};
