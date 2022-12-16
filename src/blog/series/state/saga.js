import { all, call, put, takeEvery } from "redux-saga/effects";
import { actions, Types } from "./../state";
import { callApi } from "../../../common/util/api";
import { makeFetchSaga } from "../../../common/util/fetch";

function* fetchSeries({ id }) {
  console.log(id);
  const { isSuccess, data } = yield call(callApi, {
    url: `/series/${id}`,
  });
  if (isSuccess && data) {
    yield put(actions.setValue("series", data));
  }
}
// eslint-disable-next-line import/no-anonymous-default-export
export default function* () {
  yield all([
    takeEvery(
      Types.FetchSeries,
      makeFetchSaga({ fetchSaga: fetchSeries, canCache: false })
    ),
  ]);
}
