import { all, put, call, takeLeading } from "redux-saga/effects";
import { NOT_FIND } from "../../../common/constant";
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

function* fetchSignup({ user }) {
  yield call(callApi, {
    url: "/auth/signup",
    method: "post",
    data: user,
  });
}

function* fetchUser() {
  const { isSuccess, data } = yield call(callApi, {
    url: "/auth/user",
  });

  if (isSuccess && data) {
    yield put(actions.setUser(data));
  }
}

function* fetchEmail(action) {
  yield call(callApi, {
    method: "post",
    url: "/auth/email",
    data: { email: action.email },
  });
}

function* fetchGetEmail(action) {
  const { isSuccess, data } = yield call(callApi, {
    url: "/auth/email",
    params: { id: action.id },
  });

  if (isSuccess && data) {
    yield put(actions.setValue("email", data?.address ?? NOT_FIND));
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
    takeLeading(
      Types.FetchEmail,
      makeFetchSaga({ fetchSaga: fetchEmail, canCache: false })
    ),
    takeLeading(
      Types.FetchGetEmail,
      makeFetchSaga({ fetchSaga: fetchGetEmail, canCache: false })
    ),
  ]);
}
