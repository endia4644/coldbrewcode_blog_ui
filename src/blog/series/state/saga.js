import { all, call, put, takeEvery } from "redux-saga/effects";
import { actions, Types } from "../../main/state";
import { callApi } from "../../../common/util/api";
import { makeFetchSaga } from "../../../common/util/fetch";

function* fetchAllSeries(action, page) {
  if (page <= Math.floor(action.totalCount / 8)) {
    const { isSuccess, data } = yield call(callApi, {
      url: "/series",
      params: { limit: 8, offset: 8 * page },
    });
    if (isSuccess && data) {
      if (action.series) {
        yield put(actions.setValue("series", [...action.series, ...data]));
      } else {
        yield put(actions.setValue("series", data));
      }
    }
  }
}
// eslint-disable-next-line import/no-anonymous-default-export
export default function* () {
  yield all([
    takeEvery(
      Types.FetchAllSeries,
      makeFetchSaga({ fetchSaga: fetchAllSeries, canCache: false })
    ),
  ]);
}
