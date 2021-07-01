import { combineReducers, createStore, applyMiddleware, compose  } from "redux";
import createSagaMiddleware from "redux-saga";
import homereducer from '../Screens/Home/reducers'
import rootSaga from '../sagas'


const sagaMiddleware = createSagaMiddleware();
const rootReducer = combineReducers({
    homereducer
});

export const store = createStore(rootReducer,compose(applyMiddleware(sagaMiddleware)));
sagaMiddleware.run(rootSaga);
