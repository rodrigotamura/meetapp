import {takeLatest, all, call, put} from 'redux-saga/effects';
import {showMessage} from 'react-native-flash-message';

import api from '../../../services/api';

import {signInSuccess, signFailure, signInRequest} from './actions';

export function* signIn({payload}) {
  try {
    const response = yield call(api.post, 'sessions', {
      email: payload.email,
      password: payload.password,
    });

    const {token, user} = response.data;

    api.defaults.headers.Authorization = `Bearer ${token}`;

    yield put(signInSuccess(token, user));
  } catch (error) {
    yield put(signFailure());
    showMessage({
      message: 'Authentication failed',
      description: 'Verify your e-mail / password',
      type: 'danger',
      icon: 'info',
    });
  }
}

export function* signUp({payload}) {
  try {
    const {name, email, password} = payload;

    yield call(api.post, 'users', {
      name,
      email,
      password,
    });

    yield put(signInRequest(email, password));
  } catch (error) {
    yield put(signFailure());
    showMessage({
      message: 'Registration failed',
      description: 'Please check your informations provided',
      type: 'danger',
      icon: 'info',
    });
  }
}

export function setToken({payload}) {
  if (!payload) return;

  const {token} = payload.auth;

  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }
}

export default all([
  takeLatest('persist/REHYDRATE', setToken),
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('@auth/SIGN_UP_REQUEST', signUp),
]);
