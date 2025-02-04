import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      {' '}
      {/* Wrap with SessionProvider */}
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
