import { all, put, call, takeLeading } from "redux-saga/effects";
import { callApi } from "../../../common/util/api";
import { makeFetchSaga } from "../../../common/util/fetch";
import { actions, Types } from "./index";

function* fetchLogin({ email, password }) {
  const { isSuccess, data } = yield call(callApi, {
    url: "/auth/login",
    method: "post",
    data: {
      email,
      password,
    },
  });
  if (isSuccess && data) {
    yield put(actions.setUser(data));
  }
}

function* fetchLogout() {
  const { isSuccess } = yield call(callApi, {
    url: "/auth/logout",
  });

  if (isSuccess) {
    yield put(actions.setUser(null));
  }
}

function* fetchSignup({ email }) {
  const { isSuccess, data } = yield call(callApi, {
    url: "/auth/signup",
    method: "post",
    data: {
      email,
    },
  });

  if (isSuccess && data) {
    yield put(actions.setUser(data));
  }
}

function* fetchUser() {
  const { isSuccess, data } = yield call(callApi, {
    url: "/auth/user",
  });

  if (isSuccess && data) {
    yield put(actions.setUser(data));
  }
}

export default function* () {
  yield all([
    takeLeading(
      Types.FetchLogin,
      makeFetchSaga({ fetchSaga: fetchLogin, canCache: false })
    ),
    takeLeading(
      Types.FetchSignup,
      makeFetchSaga({ fetchSaga: fetchSignup, canCache: false })
    ),
    takeLeading(
      Types.FetchUser,
      makeFetchSaga({ fetchSaga: fetchUser, canCache: false })
    ),
    takeLeading(
      Types.FetchLogout,
      makeFetchSaga({ fetchSaga: fetchLogout, canCache: false })
    ),
  ]);
}
