import { all, call, put, takeEvery } from "redux-saga/effects";
import { actions, Types } from ".";
import { callApi } from "../../../common/util/api";
import { makeFetchSaga } from "../../../common/util/fetch";

function* fetchCreatePost(action) {
  const { isSuccess, data } = yield call(callApi, {
    method: 'post',
    url: '/post',
    data: {
      postName: action.postName,
      postDescription: action.description,
      postContent: action.htmlContent,
      lockYsno: 'N'
    }
  });
  if (isSuccess && data) {
    if (action.post) {
      yield put(actions.setValue('post', [...action.post, ...data]));
    } else {
      yield put(actions.setValue('post', data));
    }
  }
}

function* fetchUpdatePost(action) {
  const { isSuccess, data } = yield call(callApi, {
    method: 'patch',
    url: '/post',
    data: {
      postId: action.postId,
      postName: action.postName,
      postDescription: action.description,
      postContent: action.htmlContent,
      lockYsno: 'N'
    }
  });
  if (isSuccess && data) {
    if (action.post) {
      yield put(actions.setValue('post', [...action.post, ...data]));
    } else {
      yield put(actions.setValue('post', data));
    }
  }
}

export default function* () {
  yield all([
    takeEvery(
      Types.FetchCreatePost,
      makeFetchSaga({ fetchSaga: fetchCreatePost, canCache: false })
    ),
    takeEvery(
      Types.FetchUpdatePost,
      makeFetchSaga({ fetchSaga: fetchUpdatePost, canCache: false })
    ),
  ]);
}