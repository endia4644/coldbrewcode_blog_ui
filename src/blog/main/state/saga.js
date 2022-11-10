import { all, call, put, takeEvery } from "redux-saga/effects";
import { actions, Types } from "../../main/state";
import { callApi } from "../../../common/util/api";
import { makeFetchSaga } from "../../../common/util/fetch";

function* fetchAutoComplete({ keyword }) {
  const { isSuccess, data } = yield call(callApi, {
    url: '/main/search',
    params: { keyword },
  });

  if (isSuccess && data) {
    yield put(actions.setValue('autoCompletes', data));
  }
}

function* fetchAllPost(action, page) {
  if (page <= Math.floor(action.totalCount / 6)) {
    const { isSuccess, data } = yield call(callApi, {
      url: '/post',
      params: { limit: 8, offset: 8 * page }
    });
    if (isSuccess && data) {
      if (action.post) {
        yield put(actions.setValue('post', [...action.post, ...data]));
      } else {
        yield put(actions.setValue('post', data));
      }
    }
  }
}

export default function* () {
  yield all([
    takeEvery(
      Types.FetchAutoComplete,
      makeFetchSaga({ fetchSaga: fetchAutoComplete, canCache: true })
    ),
    takeEvery(
      Types.FetchAllPost,
      makeFetchSaga({ fetchSaga: fetchAllPost, canCache: false })
    ),
  ]);
}