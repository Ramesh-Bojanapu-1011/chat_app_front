export const loginOptions = {
  google: {
    id: 'google',
    name: 'Google',
    type: 'oauth',
    signinUrl: `${process.env.NEXTAUTH_URL}/api/auth/signin/google`,
    callbackUrl: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
  },
  credentials: {
    id: 'credentials',
    name: 'Credentials',
    type: 'credentials',
    signinUrl: `${process.env.NEXTAUTH_URL}/api/auth/signin/credentials`,
    callbackUrl: `${process.env.NEXTAUTH_URL}/api/auth/callback/credentials`,
  },
};
