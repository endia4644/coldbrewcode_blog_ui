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

function* fetchGetZeroLevelComment(action) {
  const { isSuccess, data } = yield call(callApi, {
    url: `/comment`,
    params: {
      postId: action.postId,
    },
  });

  if (isSuccess && data) {
    console.log(data);
    yield put(actions.setValue(`comment`, [...data]));
  }
}

function* fetchGetComment(action) {
  const { isSuccess, data } = yield call(callApi, {
    url: `/comment/${action.id}`,
  });

  if (isSuccess && data) {
    yield put(actions.setValue(`comment_${data.id}`, data));
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
      parentId: action.parentId,
    },
  });

  if (isSuccess && data) {
    if (action.comment) {
      yield put(actions.setValue("comment", [...action.comment, data]));
    } else {
      yield put(actions.setValue("comment", [data]));
    }
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
      parentId: action.parentId,
    },
  });

  if (isSuccess && data) {
    yield put(actions.setValue(`comment_${data.id}`, data));
  }
}

function* fetchUpdateComment({ id, comment }) {
  yield call(callApi, {
    method: "patch",
    url: `/comment/${id}`,
    data: comment,
  });
}

function* fetchRemoveComment({ id }) {
  yield call(callApi, {
    method: "delete",
    url: `/comment/${id}`,
  });
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
      Types.FetchGetZeroLevelComment,
      makeFetchSaga({ fetchSaga: fetchGetZeroLevelComment, canCache: false })
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
      Types.FetchAddZeroLevelComment,
      makeFetchSaga({ fetchSaga: fetchAddZeroLevelComment, canCache: false })
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
