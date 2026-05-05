import { all, call, put, takeEvery } from "redux-saga/effects";
import { actions, Types } from "./index";
import { callApi } from "../../../common/util/api";
import { makeFetchSaga } from "../../../common/util/fetch";

function* fetchAllPost(action, page) {
  if (page <= Math.floor(action.totalCount / 8)) {
    const { isSuccess, data } = yield call(callApi, {
      url: "/post",
      params: {
        limit: 8,
        offset: 8 * page,
        hashtag: action?.hashtag,
        search: action?.search,
        tab: action?.tab,
        period: action?.period,
      },
    });
    if (isSuccess && data) {
      if (action.post?.length > 0) {
        yield put(actions.setValue({key: "post", value: [...action.post, ...data]}));
      } else {
        yield put(actions.setValue({key: "post", value: data}));
      }
    }
  }
}

function* fetchAllSeries(action, page) {
  if (page <= Math.floor(action.totalCount / 8)) {
    const { isSuccess, data } = yield call(callApi, {
      url: "/series",
      params: { limit: 8, offset: 8 * page },
    });
    if (isSuccess && data) {
      if (action.series) {
        yield put(actions.setValue({key: "series", value: [...action.series, ...data]}));
      } else {
        yield put(actions.setValue({key: "series", value: data}));
      }
    }
  }
}

function* fetchAllHashtag() {
  const { isSuccess, data } = yield call(callApi, {
    url: "/hashtag",
  });
  if (isSuccess && data) {
    yield put(actions.setValue("hashtag", data));
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function* () {
  yield all([
    takeEvery(
      Types.FetchAllPost,
      makeFetchSaga({ fetchSaga: fetchAllPost, canCache: false })
    ),
    takeEvery(
      Types.FetchAllSeries,
      makeFetchSaga({ fetchSaga: fetchAllSeries, canCache: false })
    ),
    takeEvery(
      Types.FetchAllHashtag,
      makeFetchSaga({ fetchSaga: fetchAllHashtag, canCache: false })
    ),
  ]);
}
