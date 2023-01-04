import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { all } from "redux-saga/effects";
import commonReducer from "../common/state";
import mainReducer from "../blog/main/state";
import mainSaga from "../blog/main/state/saga";
import writeReducer from "../blog/write/state";
import writeSaga from "../blog/write/state/saga";
import authReducer from "../blog/auth/state";
import authSaga from "../blog/auth/state/saga";
import postReducer from "../blog/post/state";
import postSaga from "../blog/post/state/saga";
import seriesReducer from "../blog/series/state";
import seriesSaga from "../blog/series/state/saga";
import likeReducer from "../blog/like/state";
import likeSaga from "../blog/like/state/saga";
import tempReducer from "../blog/temp/state";
import tempSaga from "../blog/temp/state/saga";

const reducer = combineReducers({
  common: commonReducer,
  main: mainReducer,
  write: writeReducer,
  auth: authReducer,
  post: postReducer,
  series: seriesReducer,
  like: likeReducer,
  temp: tempReducer,
});
const sagaMiddleware = createSagaMiddleware();
const composeEnhancers =
  window["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"] || compose;
const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

function* rootSaga() {
  yield all([mainSaga(), writeSaga(), authSaga(), postSaga(), seriesSaga(), likeSaga(), tempSaga()]);
}
sagaMiddleware.run(rootSaga);

export default store;
