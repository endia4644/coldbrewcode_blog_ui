import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import commonReducer from '../common/state';
import mainReducer from '../blog/main/state';
import mainSaga from '../blog/main/state/saga'

const reducer = combineReducers({
  common: commonReducer,
  main: mainReducer,
});
const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose;
const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(sagaMiddleware)),
);

function* rootSaga() {
  yield all([mainSaga()]);
}
sagaMiddleware.run(rootSaga);

export default store;
