import React from 'react';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from 'react-redux';
import {StatusBar} from 'react-native';
import FlashMessage from 'react-native-flash-message';

import './config/ReactotronConfig';

import App from './App';

import {store, persistor} from './store';

export default function index() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <StatusBar barStyle="light-content" backgroundColor="#22202C" />
        <App />
      </PersistGate>
      <FlashMessage position="bottom" floating />
    </Provider>
  );
}
