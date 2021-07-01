import {fork} from 'redux-saga/effects';

import {ReviewRequest} from '../Screens/Home/sagas/watcher'

export default function* rootSaga() {
  yield fork(ReviewRequest);
}
