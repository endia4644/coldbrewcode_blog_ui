import { all, call, put, takeEvery } from "redux-saga/effects";
import { actions, Types } from "../state";
import { actions as writeActions } from "../../write/state";
import { callApi } from "../../../common/util/api";
import { makeFetchSaga } from "../../../common/util/fetch";

function* fetchAllPost(action, page) {
  if (page <= Math.floor(action.totalCount / 8)) {
    const { isSuccess, data } = yield call(callApi, {
      url: "/post/temp",
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

function* fetchWritePost(action) {
  const { isSuccess, data } = yield call(callApi, {
    url: `/post/temp/${action?.id}`,
  });
  if (isSuccess && data) {
    yield put(writeActions.setValue("post", data));
  }
}

function* fetchDeleteTempPost(action) {
  const { isSuccess, data } = yield call(callApi, {
    url: `/post/temp/${action?.id}`,
    method: "delete"
  });
  if (isSuccess && data) {
    if (action.post) {
      if (action.post.length > 1) {
        const newPost = action.post.filter((item) => item.id !== action?.id);
        yield put(actions.setValue("post", [...newPost]));
      } else {
        yield put(actions.setValue("post", []));
      }
    } else {
      yield put(actions.setValue("post", []));
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
    takeEvery(
      Types.FetchWritePost,
      makeFetchSaga({ fetchSaga: fetchWritePost, canCache: false })
    ),
    takeEvery(
      Types.FetchDeleteTempPost,
      makeFetchSaga({ fetchSaga: fetchDeleteTempPost, canCache: false })
    ),
  ]);
}
