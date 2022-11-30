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

// eslint-disable-next-line import/no-anonymous-default-export
export default function* () {
  yield all([
    takeLeading(
      Types.FetchGetPost,
      makeFetchSaga({ fetchSaga: fetchGetPost, canCache: false })
    ),
  ]);
}
