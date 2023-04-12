import { all, call, put, takeEvery } from "redux-saga/effects";
import { actions, Types } from "../../main/state";
import { callApi } from "../../../common/util/api";
import { makeFetchSaga } from "../../../common/util/fetch";
import { actions as common } from "../../../common/state";

function* fetchAllPost(action, page) {
  if (page <= Math.floor(action.totalCount / 8)) {
    const { isSuccess, data } = yield call(callApi, {
      url: "/post",
      params: {
        limit: 8,
        offset: 8 * page,
        hashtag: action?.hashtag,
        search: action?.search,
      },
    });
    if (isSuccess && data) {
      if (action.post) {
        yield put(actions.setValue("post", [...action.post, ...data]));
      } else {
        yield put(actions.setValue("post", data));
      }
    }
    if (action?.search) {
      yield put(actions.setValue("searchCurrent", action?.search));
      yield put(actions.setValue("sideActiveKey", null));
      yield put(actions.setValue("hashtagCurrent", null));
      yield put(actions.setValue("activeKey", "post"));
    } else {
      yield put(actions.setValue("searchCurrent", null));
    }
    if (action?.hashtag) {
      yield put(actions.setValue("searchCurrent", null));
      yield put(actions.setValue("hashtagCurrent", action?.hashtag));
      yield put(actions.setValue("activeKey", "post"));
    } else {
      yield put(actions.setValue("hashtagCurrent", null));
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
        yield put(actions.setValue("series", [...action.series, ...data]));
      } else {
        yield put(actions.setValue("series", data));
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
