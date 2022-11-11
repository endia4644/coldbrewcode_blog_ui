import { all, call, put, takeEvery } from "redux-saga/effects";
import { actions, Types } from "../../main/state";
import { callApi } from "../../../common/util/api";
import { makeFetchSaga } from "../../../common/util/fetch";

function* fetchAllPost(action, page) {
  if (page <= Math.floor(action.totalCount / 6)) {
    const { isSuccess, data } = yield call(callApi, {
      url: '/post',
      params: { limit: 8, offset: 8 * page, hashtag: action?.hashtag, search: action?.search }
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

function* fetchSearchPost(action, page) {
  if (page <= Math.floor(action.totalCount / 6)) {
    const { isSuccess, data } = yield call(callApi, {
      url: '/post',
      params: { limit: 8, offset: 8 * page, search: action?.search }
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

function* fetchHashtagPost(action, page) {
  console.log(page, Math.floor(action.totalCount / 6))
  if (page <= Math.floor(action.totalCount / 6)) {
    const { isSuccess, data } = yield call(callApi, {
      url: '/post',
      params: { limit: 8, offset: 8 * page, hashtag: action?.hashtag }
    });
    if (isSuccess && data) {
      if (action.post) {
        yield put(actions.setValue('post', [...action.post, ...data]));
      } else {
        yield put(actions.setValue('post', data));
      }
      yield put(actions.setValue('hashtagCurrent', [action?.hashtag]));
    }
  }
}

function* fetchAllSeries(action, page) {
  if (page <= Math.floor(action.totalCount / 6)) {
    const { isSuccess, data } = yield call(callApi, {
      url: '/series',
      params: { limit: 8, offset: 8 * page }
    });
    if (isSuccess && data) {
      if (action.series) {
        yield put(actions.setValue('series', [...action.series, ...data]));
      } else {
        yield put(actions.setValue('series', data));
      }
    }
  }
}

function* FetchAllHashtag(action) {
  const { isSuccess, data } = yield call(callApi, {
    url: '/hashtag',
  });
  if (isSuccess && data) {
    if (action.hashtag) {
      yield put(actions.setValue('hashtag', [...action.hashtag, ...data]));
    } else {
      yield put(actions.setValue('hashtag', data));
    }
  }
}

export default function* () {
  yield all([
    takeEvery(
      Types.FetchAllPost,
      makeFetchSaga({ fetchSaga: fetchAllPost, canCache: false })
    ),
    takeEvery(
      Types.FetchHashtagPost,
      makeFetchSaga({ fetchSaga: fetchHashtagPost, canCache: false })
    ),
    takeEvery(
      Types.FetchSearchPost,
      makeFetchSaga({ fetchSaga: fetchSearchPost, canCache: false })
    ),
    takeEvery(
      Types.FetchAllSeries,
      makeFetchSaga({ fetchSaga: fetchAllSeries, canCache: false })
    ),
    takeEvery(
      Types.FetchAllHashtag,
      makeFetchSaga({ fetchSaga: FetchAllHashtag, canCache: true })
    ),
  ]);
}