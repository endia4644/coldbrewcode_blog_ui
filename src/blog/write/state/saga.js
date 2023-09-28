import { all, call, put, takeEvery } from "redux-saga/effects";
import { actions, Types } from ".";
import { callApi } from "../../../common/util/api";
import { makeFetchSaga } from "../../../common/util/fetch";

function* fetchPost(action) {
  const { isSuccess, data } = yield call(callApi, {
    url: `/post/detail/${action.id}`,
  });
  if (isSuccess && data) {
    yield put(actions.setValue("post", data));
  }
}

function* fetchCreatePost(action) {
  const { isSuccess } = yield call(callApi, {
    method: "post",
    url: "/post",
    data: {
      postName: action.postName,
      hashtags: action.hashtags,
      postDescription: action.postDescription,
      postContent: action.postContent,
      postThumbnail: action.postThumbnail,
      permission: action.permission,
      seriesName: action.seriesName,
      imageIds: action.imageIds,
      tempId: action.tempId,
    },
  });
  if (isSuccess) {
    yield put(
      actions.setValue("txnCmpt", true)
    );
  } else {
    yield put(actions.setValue("isFetching", false));
  }
}

function* fetchUpdatePost(action) {
  const { isSuccess } = yield call(callApi, {
    method: "patch",
    url: "/post",
    data: {
      postId: action.postId,
      postName: action.postName,
      hashtags: action.hashtags,
      postDescription: action.postDescription,
      postContent: action.postContent,
      postThumbnail: action.postThumbnail,
      permission: action.permission,
      seriesOriId: action.seriesOriId,
      seriesOriName: action.seriesOriName,
      seriesName: action.seriesName,
      imageIds: action.imageIds,
      tempId: action.tempId,
    },
  });
  if (isSuccess) {
    yield put(
      actions.setValue("txnCmpt", true)
    );
  } else {
    yield put(actions.setValue("isFetching", false));
  }
}

function* fetchAllSeries(action) {
  const { isSuccess, data } = yield call(callApi, {
    url: "/series/name",
  });
  if (isSuccess && data) {
    if (action.series) {
      yield put(
        actions.setValue("seriesList", [...action.seriesList, ...data])
      );
    } else {
      yield put(actions.setValue("seriesList", data));
    }
  }
}

function* fetchCreateSeries(action) {
  const { isSuccess, data } = yield call(callApi, {
    method: "post",
    url: "/series",
    data: {
      seriesName: action.seriesName,
    },
  });
  if (isSuccess && data) {
    if (action.series) {
      yield put(
        actions.setValue("seriesList", [...action.seriesList, ...data])
      );
    } else {
      yield put(actions.setValue("seriesList", data));
    }
  }
}

function* fetchCreateTempPost(action) {
  const { isSuccess } = yield call(callApi, {
    method: "post",
    url: "/post/temp",
    data: {
      postId: action.postId,
      tempId: action.tempId,
      postName: action.postName,
      hashtags: action.hashtags,
      postDescription: action.postDescription,
      postContent: action.postContent,
      postThumbnail: action.postThumbnail,
      permission: action.permission,
      seriesName: action.seriesName,
      imageIds: action.imageIds,
    },
  });
  if (isSuccess) {
    yield put(
      actions.setValue("txnCmpt", true)
    );
  } else {
    yield put(actions.setValue("isFetching", false));
  }
}

function* fetchCreateTempPostContinue(action) {
  const { isSuccess, data } = yield call(callApi, {
    method: "post",
    url: "/post/temp",
    data: {
      postId: action.postId,
      tempId: action.tempId,
      postName: action.postName,
      hashtags: action.hashtags,
      postDescription: action.postDescription,
      postContent: action.postContent,
      postThumbnail: action.postThumbnail,
      permission: action.permission,
      seriesName: action.seriesName,
      imageIds: action.imageIds,
    },
  });
  if (isSuccess && data) {
    yield put(
      actions.setValue("tempId", data)
    );
  }
  yield put(actions.setValue("isFetching", false));
}

function* fetchTempPost(action) {
  const { isSuccess, data } = yield call(callApi, {
    url: `/post/temp/${action?.id}?id=${action.postId}`,
  });
  if (isSuccess && data) {
    yield put(actions.setValue("post", data));
  }
}

function* fetchDeleteTempPost(action) {
  yield call(callApi, {
    url: `/post/temp/${action?.id}`,
    method: "delete"
  });
}

function* fetchCreateSeriesImage({ imageId, fileName, seriesName }) {
  yield call(callApi, {
    url: `/series/image`,
    method: "patch",
    data: {
      imageId,
      fileName,
      seriesName
    }
  });
}

function* fetchDeleteSeriesImage({ seriesName }) {
  const { isSuccess } = yield call(callApi, {
    url: `/series/image`,
    method: "delete",
    data: {
      seriesName
    }
  });
  if (isSuccess) {
    yield put(actions.setValue("seriesThumbnail", null));
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function* () {
  yield all([
    takeEvery(
      Types.FetchPost,
      makeFetchSaga({ fetchSaga: fetchPost, canCache: false })
    ),
    takeEvery(
      Types.FetchCreatePost,
      makeFetchSaga({ fetchSaga: fetchCreatePost, canCache: false })
    ),
    takeEvery(
      Types.FetchUpdatePost,
      makeFetchSaga({ fetchSaga: fetchUpdatePost, canCache: false })
    ),
    takeEvery(
      Types.FetchAllSeries,
      makeFetchSaga({ fetchSaga: fetchAllSeries, canCache: false })
    ),
    takeEvery(
      Types.FetchCreateSeries,
      makeFetchSaga({ fetchSaga: fetchCreateSeries, canCache: false })
    ),
    takeEvery(
      Types.FetchCreateTempPost,
      makeFetchSaga({ fetchSaga: fetchCreateTempPost, canCache: false })
    ),
    takeEvery(
      Types.FetchCreateTempPostContinue,
      makeFetchSaga({ fetchSaga: fetchCreateTempPostContinue, canCache: false })
    ),
    takeEvery(
      Types.FetchTempPost,
      makeFetchSaga({ fetchSaga: fetchTempPost, canCache: false })
    ),
    takeEvery(
      Types.FetchDeleteTempPost,
      makeFetchSaga({ fetchSaga: fetchDeleteTempPost, canCache: false })
    ),
    takeEvery(
      Types.FetchCreateSeriesImage,
      makeFetchSaga({ fetchSaga: fetchCreateSeriesImage, canCache: false })
    ),
    takeEvery(
      Types.FetchDeleteSeriesImage,
      makeFetchSaga({ fetchSaga: fetchDeleteSeriesImage, canCache: false })
    ),
  ]);
}