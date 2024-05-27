import { all, call, put, takeEvery } from "redux-saga/effects";
import { actions, Types } from "../../main/state";
import { callApi } from "../../../common/util/api";
import { makeFetchSaga } from "../../../common/util/fetch";
import { actions as common } from "../../../common/state";

function* fetchAllPost(action, page) {
  if (page <= Math.floor(action.totalCount / 8)) {
    const { isSuccess, data } = yield call(callApi, {
      url: "/post",
      params: {
        limit: 8,
        offset: 8 * page,
        hashtag: action?.hashtag,
        search: action?.search,
      },
    });
    if (isSuccess && data) {
      if (action.post) {
        if (action?.search) {
          data.forEach((element) => {
            let sPostName = element.postName;
            let sPostContent =
              " " +
              element.postContent
                .replace(/(<([^>]+)>)/gi, "")
                .replace(/&nbsp;/g, " ");

            if (sPostName.indexOf(action?.search) > 0) {
              if (sPostName.indexOf(action?.search) > 50) {
                sPostName = sPostName.substring(
                  sPostName.indexOf(action?.search) - 50,
                  sPostName.indexOf(action?.search) + 50
                );
              } else {
                sPostName = sPostName.substring(0, 50);
              }
              const reg = new RegExp(action?.search, "gi");
              sPostName = sPostName.replace(
                reg,
                `<mark style="background-color:yellow">${action?.search}</mark>`
              );
            }
            let SearchIndex = sPostContent
              .toLowerCase()
              .indexOf(action?.search?.toLowerCase());
            if (SearchIndex > 0) {
              if (SearchIndex > 50) {
                sPostContent = `...${sPostContent.substring(
                  SearchIndex - 50,
                  SearchIndex + (50 + action?.search.length)
                )}...`;
              } else {
                sPostContent = `${sPostContent.substring(0, 50)}...`;
              }
              const reg = new RegExp(action?.search, "gi");
              sPostContent = sPostContent.replace(
                reg,
                `<mark style="background-color:yellow">${action?.search}</mark>`
              );
            } else {
              if (action?.search.match(/\s/)) {
                let wordArray = action?.search.split(" ");
                wordArray.forEach((ele) => {
                  if (sPostContent.indexOf(ele) > 0) {
                    if (sPostContent.indexOf(ele) > 50) {
                      sPostContent = `...${sPostContent.substring(
                        sPostContent.indexOf(ele) - 50,
                        sPostContent.indexOf(ele) + (50 + ele.length)
                      )}...`;
                    } else {
                      sPostContent = `${sPostContent.substring(0, 50)}...`;
                    }
                    const reg = new RegExp(ele, "gi");
                    sPostContent = sPostContent.replace(
                      reg,
                      `<mark>${ele}</mark>`
                    );
                  }
                });
              } else {
                sPostContent = `${sPostContent.substring(0, 50)}...`;
              }
            }

            element["sPostName"] = sPostName;
            element["sPostContent"] = sPostContent;
          });
        }
        yield put(actions.setValue("post", [...action.post, ...data]));
      } else {
        yield put(actions.setValue("post", data));
      }
    }
    if (action?.search) {
      yield put(actions.setValue("searchCurrent", action?.search));
      yield put(actions.setValue("sideActiveKey", null));
      yield put(actions.setValue("hashtagCurrent", null));
    } else {
      yield put(actions.setValue("searchCurrent", null));
    }
    if (action?.hashtag) {
      yield put(actions.setValue("searchCurrent", null));
      yield put(actions.setValue("hashtagCurrent", action?.hashtag));
    } else {
      yield put(actions.setValue("hashtagCurrent", null));
    }
    yield put(actions.setValue("activeKey", "post"));
  }
}

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

function* fetchAllHashtag() {
  const { isSuccess, data } = yield call(callApi, {
    url: "/hashtag",
  });
  if (isSuccess && data) {
    yield put(actions.setValue("hashtag", data));
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function* () {
  yield all([
    takeEvery(
      Types.FetchAllPost,
      makeFetchSaga({ fetchSaga: fetchAllPost, canCache: false })
    ),
    takeEvery(
      Types.FetchAllSeries,
      makeFetchSaga({ fetchSaga: fetchAllSeries, canCache: false })
    ),
    takeEvery(
      Types.FetchAllHashtag,
      makeFetchSaga({ fetchSaga: fetchAllHashtag, canCache: false })
    ),
  ]);
}
