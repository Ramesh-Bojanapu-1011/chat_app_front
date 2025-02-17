// {
//     google: {
//       id: 'google',
//       name: 'Google',
//       type: 'oauth',
//       signinUrl: 'http://localhost:3000/api/auth/signin/google',
//       callbackUrl: 'http://localhost:3000/api/auth/callback/google'
//     },
//     facebook: {
//       id: 'facebook',
//       name: 'Facebook',
//       type: 'oauth',
//       signinUrl: 'http://localhost:3000/api/auth/signin/facebook',
//       callbackUrl: 'http://localhost:3000/api/auth/callback/facebook'
//     },
//     credentials: {
//       id: 'credentials',
//       name: 'Credentials',
//       type: 'credentials',
//       signinUrl: 'http://localhost:3000/api/auth/signin/credentials',
//       callbackUrl: 'http://localhost:3000/api/auth/callback/credentials'
//     }
//   }

export const loginOptions = {
  google: {
    id: 'google',
    name: 'Google',
    type: 'oauth',
    signinUrl: `${process.env.NEXTAUTH_URL}/api/auth/signin/google`,
    callbackUrl: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    type: 'oauth',
    signinUrl: `${process.env.NEXTAUTH_URL}/api/auth/signin/facebook`,
    callbackUrl: `${process.env.NEXTAUTH_URL}/api/auth/callback/facebook`,
  },
  credentials: {
    id: 'credentials',
    name: 'Credentials',
    type: 'credentials',
    signinUrl: `${process.env.NEXTAUTH_URL}/api/auth/signin/credentials`,
    callbackUrl: `${process.env.NEXTAUTH_URL}/api/auth/callback/credentials`,
  },
};
