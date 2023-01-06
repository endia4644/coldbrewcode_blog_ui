import { all, call, put, takeEvery } from "redux-saga/effects";
import { actions, Types } from "../state";
import { actions as authActions } from "../../auth/state";
import { callApi } from "../../../common/util/api";
import { makeFetchSaga } from "../../../common/util/fetch";

function* fetchCreateProfileImg({ formData, fileBlob }) {
  const reader = new FileReader();
  reader.readAsDataURL(fileBlob);
  const { isSuccess, data } = yield call(callApi, {
    url: "/image/profile",
    method: 'post',
    data: formData
  });
  if (isSuccess && data) {
    yield put(authActions.setValue("user", data));
    yield put(actions.setValue("profileImg", reader.result));
  }
}

function* fetchDeleteProfileImg() {
  const { isSuccess, data } = yield call(callApi, {
    url: "/image/profile",
    method: 'delete',
  });
  if (isSuccess && data) {
    yield put(authActions.setValue("user", data));
    yield put(actions.setValue("profileImg", null));
  }
}

function* fetchUpdateNickName({ nickName }) {
  const { isSuccess, data } = yield call(callApi, {
    url: "/user/nickname",
    method: 'patch',
    data: { nickName }
  });
  if (isSuccess && data) {
    yield put(authActions.setValue("user", data));
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function* () {
  yield all([
    takeEvery(
      Types.FetchCreateProfileImg,
      makeFetchSaga({ fetchSaga: fetchCreateProfileImg, canCache: false })
    ),
    takeEvery(
      Types.FetchDeleteProfileImg,
      makeFetchSaga({ fetchSaga: fetchDeleteProfileImg, canCache: false })
    ),
    takeEvery(
      Types.FetchUpdateNickName,
      makeFetchSaga({ fetchSaga: fetchUpdateNickName, canCache: false })
    ),
  ]);
}
