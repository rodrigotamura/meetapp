import {takeLatest, all, call, put} from 'redux-saga/effects';
import {showMessage} from 'react-native-flash-message';
import * as Yup from 'yup';

import api from '../../../services/api';

import {updateProfileSuccess, updateProfileFailure} from './actions';

const schema = Yup.object().shape({
  avatar_id: Yup.number(),
  name: Yup.string().required('Please, inform full name'),
  email: Yup.string()
    .email('A valid e-mail is necessary')
    .required('Please, inform your email'),
  oldPassword: Yup.string(),
  password: Yup.string().when('oldPassword', (oldPassword, field) =>
    oldPassword
      ? field
          .required('Please, inform your new password')
          .min(6, 'It is necessary at least 6 characters')
      : field,
  ),
  confirmPassword: Yup.string().when('password', (password, field) =>
    password
      ? field
          .required('Please, inform the password confirmation')
          .oneOf(
            [Yup.ref('password')],
            'Password confirmation must be equal to the new password',
          )
      : field,
  ),
});

export function* updateProfile({payload}) {
  try {
    const {name, email, avatar_id, ...rest} = payload.data;

    console.tron.log(payload.data);

    const profile = {
      name,
      email,
      avatar_id: avatar_id && avatar_id,
      ...(rest.oldPassword ? rest : {}),
    };

    schema.validateSync(profile);

    const response = yield call(api.put, 'users', profile);

    yield put(updateProfileSuccess(response.data));

    showMessage({
      message: 'Profile updated',
      description: 'The new information was successfully sent to your servers',
      type: 'success',
      icon: 'success',
    });
  } catch (error) {
    yield put(updateProfileFailure());

    showMessage({
      message: 'Update error',
      description: 'Error updating profile, check your account info',
      type: 'danger',
      icon: 'info',
    });
  }
}

export default all([takeLatest('@user/UPDATE_PROFILE_REQUEST', updateProfile)]);
