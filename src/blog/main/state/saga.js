import { all, call, put, takeEvery } from "redux-saga/effects";
import { actions, Types } from "./index";
import { callApi } from "../../../common/util/api";
import { makeFetchSaga } from "../../../common/util/fetch";
import {FETCH_KEY} from "../../../common/redux-helper";
import {isEmpty} from "../../../common/util/util";

function* fetchAllPost(action, page) {
  if (page <= Math.floor(action.totalCount / 8)) {
    const { isSuccess, data } = yield call(callApi, {
      url: "/post",
      params: {
        limit: 8,
        offset: 8 * page,
        hashtag: action?.hashtag,
        search: action?.search,
        nickname: action?.nickname,
      },
    });
    if (isSuccess && data) {
      if (action.post.length > 0) {
        if (!isEmpty(action?.search)) {
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
            console.log(sPostContent)
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
        yield put(actions.setValue({ key: "post", value: [...action.post, ...data], fetchKey: action[FETCH_KEY]}));
      } else {
        yield put(actions.setValue({ key: "post", value: data, fetchKey: action[FETCH_KEY]}));
      }
    } else {
      yield put(actions.setValue({ key: "post", value: [], fetchKey: action[FETCH_KEY]}));
    }
    if (action?.search) {
      yield put(actions.setValue({ key: "searchCurrent", value: action?.search, fetchKey: action[FETCH_KEY]}));
      yield put(actions.setValue({ key: "sideActiveKey", value: {}, fetchKey: action[FETCH_KEY]}));
      yield put(actions.setValue({ key: "hashtagCurrent", value: {}, fetchKey: action[FETCH_KEY]}));
    } else {
      yield put(actions.setValue({ key: "searchCurrent", value: {}, fetchKey: action[FETCH_KEY]}));
    }
    if (action?.hashtag) {
      yield put(actions.setValue({ key: "searchCurrent", value: {}, fetchKey: action[FETCH_KEY]}));
      yield put(actions.setValue({ key: "hashtagCurrent", value: action?.hashtag, fetchKey: action[FETCH_KEY]}));
    } else {
      yield put(actions.setValue({ key: "hashtagCurrent", value: {}, fetchKey: action[FETCH_KEY]}));
    }
    yield put(actions.setValue({ key: "activeKey", value: "post", fetchKey: action[FETCH_KEY]}));
  }
}

function* fetchAllSeries(action, page) {
  if (page <= Math.floor(action.totalCount / 8)) {
    const { isSuccess, data } = yield call(callApi, {
      url: "/series",
      params: { limit: 8, offset: 8 * page, nickname: action?.nickname },
    });
    if (isSuccess && data) {
      if (action.series) {
        yield put(actions.setValue({ key: "series", value: [...action.series, ...data], fetchKey: action[FETCH_KEY]}));
      } else {
        yield put(actions.setValue({ key: "series", value: data, fetchKey: action[FETCH_KEY]}));
      }
    }
  }
}

function* fetchAllHashtag(action) {
  const { isSuccess, data } = yield call(callApi, {
    url: "/hashtag",
    params: { nickname: action[FETCH_KEY] },
  });
  if (isSuccess && data) {
    yield put(actions.setValue({ key: "hashtag", value: data, fetchKey: action[FETCH_KEY]}));
  } else {
    yield put(actions.setValue({ key: "hashtag", value: [], fetchKey: action[FETCH_KEY]}));
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
