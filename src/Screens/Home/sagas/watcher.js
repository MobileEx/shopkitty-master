import { takeLatest, call, put } from "redux-saga/effects";
import * as types from '../actions'
 import {root_review} from './worker'

// watcher saga
export function* ReviewRequest() {
  yield takeLatest(types.REVIEW_SUCCESS, root_review);
}
