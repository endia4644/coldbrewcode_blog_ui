import { all, call, put, takeEvery } from "redux-saga/effects";
import { actions, Types } from "../state";
import { callApi } from "../../../common/util/api";
import { makeFetchSaga } from "../../../common/util/fetch";

function* fetchAllPost(action, page) {
  if (page <= Math.floor(action.totalCount / 8)) {
    const { isSuccess, data } = yield call(callApi, {
      url: "/post/like",
      params: {
        limit: 8,
        offset: 8 * page,
      },
    });
    if (isSuccess && data) {
      if (action.post) {
        yield put(actions.setValue("post", [...action.post, ...data]));
      } else {
        yield put(actions.setValue("post", data));
      }
    }
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function* () {
  yield all([
    takeEvery(
      Types.FetchAllPost,
      makeFetchSaga({ fetchSaga: fetchAllPost, canCache: false })
    ),
  ]);
}
