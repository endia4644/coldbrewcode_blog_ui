import { all, put, call, takeLeading } from "redux-saga/effects";
import { callApi } from "../../../common/util/api";
import { makeFetchSaga } from "../../../common/util/fetch";
import { actions, Types } from "./index";

function* fetchGetPost({ id }) {
  const { isSuccess, data } = yield call(callApi, {
    url: `/post/${id}`,
  });
  if (isSuccess && data) {
    yield put(actions.setValue("post", data));
    yield put(actions.setValue("commentCount", data?.commentCount));
  }
}

function* fetchAddPostLike({ id }) {
  yield call(callApi, {
    method: "post",
    url: `/post/${id}/like`,
  });
}

function* fetchRemovePostLike({ id }) {
  yield call(callApi, {
    method: "delete",
    url: `/post/${id}/like`,
  });
}

function* fetchGetComment(action) {
  const { isSuccess, data } = yield call(callApi, {
    url: `/comment/${action.id}`,
    params: {
      postId: action.postId
<<<<<<< HEAD
    }
  });

  if (isSuccess && data) {
    yield put(actions.setValue(`comment_${action.id}`, data));
  }
}

function* fetchAddZeroLevelComment(action) {
  const { isSuccess, data } = yield call(callApi, {
    method: "post",
    url: `/comment`,
    data: {
      commentContent: action.commentContent,
      commentDepth: action.commentDepth,
      postId: action.postId,
      parentId: action.parentId
    }
  });

  if (isSuccess && data) {
    if (action.comment) {
      yield put(actions.setValue('comment', [...action.comment, data]));
    } else {
      yield put(actions.setValue('comment', [data]));
=======
>>>>>>> 6381bbea8319dd0baaae63b4a0c352b5113505d5
    }
  });

  if (isSuccess && data) {
    yield put(actions.setValue(`comment_${action.id}`, data));
  }
}

function* fetchAddComment(action) {
  const { isSuccess, data } = yield call(callApi, {
    method: "post",
    url: `/comment`,
    data: {
      commentContent: action.commentContent,
      commentDepth: action.commentDepth,
      postId: action.postId,
      parentId: action.parentId
    }
  });

  if (isSuccess && data) {
    if(Number(action.commentDepth) === 0) {
      yield put(actions.setValue('comment_0', data));
    } else {
      yield put(actions.setValue(`comment_${data.id}`, data));
    }
    yield put(actions.setValue("commentCount", ++action.commentCount));
  }
}

function* fetchUpdateComment({ id, comment }) {
  yield call(callApi, {
    method: "patch",
    url: `/comment/${id}`,
    data: comment,
  });
}

function* fetchRemoveComment({ action }) {
  const { isSuccess, data } = yield call(callApi, {
    method: "delete",
    url: `/comment/${action.id}`,
  });

  if (isSuccess && data) {
    if(Number(action.commentDepth) === 0) {
      yield put(actions.setValue('comment_0', data));
    } else {
      yield put(actions.setValue(`comment_${data.id}`, data));
    }
    yield put(actions.setValue("commentCount", --action.commentCount));
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function* () {
  yield all([
    takeLeading(
      Types.FetchGetPost,
      makeFetchSaga({ fetchSaga: fetchGetPost, canCache: false })
    ),
    takeLeading(
      Types.FetchAddPostLike,
      makeFetchSaga({ fetchSaga: fetchAddPostLike, canCache: false })
    ),
    takeLeading(
      Types.FetchRemovePostLike,
      makeFetchSaga({ fetchSaga: fetchRemovePostLike, canCache: false })
    ),
    takeLeading(
      Types.FetchGetComment,
      makeFetchSaga({ fetchSaga: fetchGetComment, canCache: false })
    ),
    takeLeading(
      Types.FetchAddComment,
      makeFetchSaga({ fetchSaga: fetchAddComment, canCache: false })
    ),
    takeLeading(
      Types.FetchUpdateComment,
      makeFetchSaga({ fetchSaga: fetchUpdateComment, canCache: false })
    ),
    takeLeading(
      Types.FetchRemoveComment,
      makeFetchSaga({ fetchSaga: fetchRemoveComment, canCache: false })
    ),
  ]);
}
