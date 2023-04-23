import { all, call, put, takeEvery } from "redux-saga/effects";
import { actions, Types } from "./../state";
import { callApi } from "../../../common/util/api";
import { makeFetchSaga } from "../../../common/util/fetch";

/**
 * 
 * @param {{
 *  id: String,   //시리즈 ID
 *  order: String //정렬기준(desc , asc)
 * }} param
 * @description 시리즈 정보롤 조회한다.
 * @returns {Object}
 */
function* fetchSeries({ id, order }) {
  const { isSuccess, data } = yield call(callApi, {
    url: `/series/${id}`,
    params: {
      order
    }
  });
  if (isSuccess) {
    yield put(actions.setValue("series", data ?? null));
    yield put(actions.setValue("posts", data?.Posts ?? []));
    if (order) {
      yield put(actions.setValue("order", order));
    }
  }
}

/**
 * 
 * @param {{
 *  id: String,   //시리즈 ID
 *  posts: Array  //게시글 리스트
 * }} param
 * @description 시리즈에 속한 게시글들의 순서를 조정하거나 속한 게시글을 삭제한다.
 * @returns {Object}
 */
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

/**
 * 
 * @param {{
 *  id: String,   //시리즈 ID
 * }} param
 * @description 시리즈를 삭제한다.
 */
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
