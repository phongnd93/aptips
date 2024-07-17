import { SettingsValueProps } from './components/settings/type';
// routes
import { PATH_DASHBOARD, SUI_DONA_PATH } from './routes/paths';

// API
// ----------------------------------------------------------------------

export const FIREBASE_API = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APPID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

export const COGNITO_API = {
  userPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
  clientId: process.env.AWS_COGNITO_CLIENT_ID,
};

export const AUTH0_API = {
  clientId: process.env.AUTH0_CLIENT_ID,
  domain: process.env.AUTH0_DOMAIN,
};

export const MAPBOX_API = process.env.MAPBOX;
// export const API = process.env.API || 'http://164.68.106.205:3000/api';
export const API = process.env.API || 'http://localhost:3000/api';
export const SUI_CONFIG = {
  "URL_ZK_PROVER": process.env.URL_ZK_PROVER || "https://prover-dev.mystenlabs.com/v1",
  "URL_SALT_SERVICE": process.env.URL_SALT_SERVICE || "/dummy-salt-service.json",
  "CLIENT_ID_GOOGLE": process.env.CLIENT_ID_GOOGLE || "759483717679-4psela87sjf61731nd40bsss9f0n47uh.apps.googleusercontent.com",
  "CLIENT_ID_TWITCH": process.env.TWITCH_CLIENT_ID || "YOUR_TWITCH_CLIENT_ID",
  "CLIENT_ID_FACEBOOK": process.env.FACEBOOK_CLIENT_ID || "YOUR_FACEBOOK_CLIENT_ID"
};

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = '/dashboard'; // as '/dashboard/app'

// LAYOUT
// ----------------------------------------------------------------------

export const HEADER = {
  MOBILE_HEIGHT: 64,
  MAIN_DESKTOP_HEIGHT: 88,
  DASHBOARD_DESKTOP_HEIGHT: 92,
  DASHBOARD_DESKTOP_OFFSET_HEIGHT: 92 - 32,
};

export const NAVBAR = {
  BASE_WIDTH: 260,
  DASHBOARD_WIDTH: 280,
  DASHBOARD_COLLAPSE_WIDTH: 88,
  //
  DASHBOARD_ITEM_ROOT_HEIGHT: 48,
  DASHBOARD_ITEM_SUB_HEIGHT: 40,
  DASHBOARD_ITEM_HORIZONTAL_HEIGHT: 32,
};

export const ICON = {
  NAVBAR_ITEM: 22,
  NAVBAR_ITEM_HORIZONTAL: 20,
};

// SETTINGS
// ----------------------------------------------------------------------

export const cookiesExpires = 3;

export const cookiesKey = {
  themeMode: 'themeMode',
  themeDirection: 'themeDirection',
  themeColorPresets: 'themeColorPresets',
  themeLayout: 'themeLayout',
  themeStretch: 'themeStretch',
};

export const defaultSettings: SettingsValueProps = {
  themeMode: 'light',
  themeDirection: 'ltr',
  themeColorPresets: 'default',
  themeLayout: 'horizontal',
  themeStretch: false,
};
