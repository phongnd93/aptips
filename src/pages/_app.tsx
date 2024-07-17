// i18n
import '../locales/i18n';

// highlight
import '../utils/highlight';

// scroll bar
import 'simplebar/src/simplebar.css';

// lightbox
import '@mysten/dapp-kit/dist/index.css';

// map
import 'mapbox-gl/dist/mapbox-gl.css';

// editor
import 'react-quill/dist/quill.snow.css';

// slick-carousel
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// lazy image
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'react-lazy-load-image-component/src/effects/opacity.css';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';

// fullcalendar
import '@fullcalendar/common/main.min.css';

import cookie from 'cookie';
import { ReactElement, ReactNode } from 'react';
// next
import { NextPage } from 'next';
import Head from 'next/head';
import App, { AppProps, AppContext } from 'next/app';
//
import { Provider as ReduxProvider } from 'react-redux';
// @mui
// redux
import { store, persistor } from '../redux/store';
// utils
import { getSettings } from '../utils/settings';
import { SettingsValueProps } from '../components/settings/type';
// contexts
import { SettingsProvider } from '../contexts/SettingsContext';
import { CollapseDrawerProvider } from '../contexts/CollapseDrawerContext';
// theme
import ThemeProvider from '../theme';
// components
import { ChartStyle } from '../components/chart';
import RtlLayout from '../components/RtlLayout';
import ProgressBar from '../components/ProgressBar';
import ThemeColorPresets from '../components/ThemeColorPresets';
import NotistackProvider from '../components/NotistackProvider';
import ThemeLocalization from '../components/ThemeLocalization';
import MotionLazyContainer from '../components/animate/MotionLazyContainer';

// Check our docs
// https://docs-minimals.vercel.app/authentication/ts-version

import { SuiAuthProvider } from 'src/contexts/SuiAuthContext';
// import { AuthProvider } from '../contexts/JWTContext';
// import { AuthProvider } from '../contexts/Auth0Context';
// import { AuthProvider } from '../contexts/FirebaseContext';
// import { AuthProvider } from '../contexts/AwsCognitoContext';
import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui.js/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PersistGate } from 'redux-persist/integration/react';

// ----------------------------------------------------------------------

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface MyAppProps extends AppProps
{
  settings: SettingsValueProps;
  Component: NextPageWithLayout;
}

export default function MyApp(props: MyAppProps)
{
  const { Component, pageProps, settings } = props;
  // Config options for the networks you want to connect to
  const { networkConfig } = createNetworkConfig({
    localnet: { url: getFullnodeUrl('localnet') },
    mainnet: { url: getFullnodeUrl('mainnet') },
    devnet: { url: getFullnodeUrl('devnet') }
  });

  const getLayout = Component.getLayout ?? ((page) => page);
  const queryClient = new QueryClient();
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider defaultNetwork='devnet' networks={networkConfig}>
          <WalletProvider autoConnect>
            <SuiAuthProvider createNewAccount={true}>
              <ReduxProvider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                  <CollapseDrawerProvider>
                    <SettingsProvider defaultSettings={settings}>
                      <ThemeProvider>
                        <NotistackProvider>
                          <MotionLazyContainer>
                            <ThemeColorPresets>
                              <ThemeLocalization>
                                <RtlLayout>
                                  <ChartStyle />
                                  {/* PHONG: Hide setting buttons
                              <Settings /> */}
                                  <ProgressBar />
                                  {getLayout(<Component {...pageProps} />)}
                                </RtlLayout>
                              </ThemeLocalization>
                            </ThemeColorPresets>
                          </MotionLazyContainer>
                        </NotistackProvider>
                      </ThemeProvider>
                    </SettingsProvider>
                  </CollapseDrawerProvider>
                </PersistGate>
              </ReduxProvider>
            </SuiAuthProvider>
          </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    </>
  );
}

// ----------------------------------------------------------------------

MyApp.getInitialProps = async (context: AppContext) =>
{
  const appProps = await App.getInitialProps(context);

  const cookies = cookie.parse(
    context.ctx.req ? context.ctx.req.headers.cookie || '' : document.cookie
  );

  const settings = getSettings(cookies);

  return {
    ...appProps,
    settings,
  };
};
