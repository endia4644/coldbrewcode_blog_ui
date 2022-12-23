import { all, call, put, takeEvery } from "redux-saga/effects";
import { actions, Types } from "./../state";
import { callApi } from "../../../common/util/api";
import { makeFetchSaga } from "../../../common/util/fetch";

function* fetchSeries({ id }) {
  const { isSuccess, data } = yield call(callApi, {
    url: `/series/${id}`,
  });
  if (isSuccess) {
    yield put(actions.setValue("series", data ?? null));
    yield put(actions.setValue("posts", data?.Posts ?? []));
  }
}

function* fetchUpdateSeries({ id, posts }) {
  const { isSuccess, data } = yield call(callApi, {
    url: `/series/${id}/order`,
    method: 'patch',
    data: {
      posts
    }
  });
  if (isSuccess && data) {
    yield put(actions.setValue("posts", data?.Posts));
  }
}

function* fetchDeleteSeries({ id }) {
  yield call(callApi, {
    url: `/series/${id}`,
    method: 'delete',
  });
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function* () {
  yield all([
    takeEvery(
      Types.FetchSeries,
      makeFetchSaga({ fetchSaga: fetchSeries, canCache: false })
    ),
    takeEvery(
      Types.FetchUpdateSeries,
      makeFetchSaga({ fetchSaga: fetchUpdateSeries, canCache: false })
    ),
    takeEvery(
      Types.FetchDeleteSeries,
      makeFetchSaga({ fetchSaga: fetchDeleteSeries, canCache: false })
    ),
  ]);
}
