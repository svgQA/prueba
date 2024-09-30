export const AWS_AMPLIFY_SETTINGS = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_AWS_COGNITO_USER_POOL_ID || '',
      userPoolClientId: import.meta.env.VITE_AWS_COGNITO_CLIENT_ID || '',
      // identityPoolId: '',
      loginWith: {
        // oauth: {
        //   domain:
        //     'abcdefghij1234567890-29051e27.auth.us-east-1.amazoncognito.com',
        //   scopes: [
        //     'openid',
        //     'email',
        //     'phone',
        //     'profile',
        //     'aws.cognito.signin.user.admin',
        //   ],
        //   redirectSignIn: ['http://localhost:3050/dashboard'],
        //   redirectSignOut: ['http://localhost:3000/', 'https://example.com/'],
        //   responseType: 'code',
        // },
        username: true,
        email: false,
        phone: false,
      },
    },
  },
};
