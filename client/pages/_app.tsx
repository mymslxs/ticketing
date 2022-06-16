import 'bootstrap/dist/css/bootstrap.css';

import type { AppContext, AppProps } from 'next/app';
import buildClient from '../api/build-app';
import Header from '../components/Header';
import Layout from '../components/Layout';

interface AppComponentProps extends AppProps {
  currentUser: {
    email: string;
    id: string;
  } | null;
}

const AppComponent = ({
  Component,
  pageProps,
  currentUser,
}: AppComponentProps) => {
  return (
    <Layout>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </Layout>
  );
};

AppComponent.getInitialProps = async (appContext: AppContext) => {
  let pageProps;
  try {
    const client = buildClient(appContext.ctx);
    const { data } = await client.get('/api/users/current-user');

    if (appContext.Component.getInitialProps) {
      pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    }
    return {
      pageProps,
      ...data,
    };
  } catch (err) {
    return { currentUser: null };
  }
};

export default AppComponent;
