import { all, call, put, takeEvery } from "redux-saga/effects";
import { actions, Types } from "./index";
import { callApi } from "../../../common/util/api";
import { makeFetchSaga } from "../../../common/util/fetch";

function* fetchSearchPost(action, page) {
  if (page <= Math.floor(action.totalCount / 8)) {
    console.log(action.search);
    const { isSuccess, data } = yield call(callApi, {
      url: "/post",
      params: {
        limit: 8,
        offset: 8 * page,
        nickname: action?.nickname,
        search: action?.search,
      },
    });
    if (isSuccess && data) {
      if (action.post.length > 0) {
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
        yield put(actions.setValue({key: "post", value: [...action.post, ...data]}));
        yield put(actions.setValue({key: "searchCurrent", value: action?.search}));
      } else {
        yield put(actions.setValue({key: "post", value: data}));
      }
    }
    yield put(actions.setValue({key: "activeKey", value: "post"}));
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function* () {
  yield all([
    takeEvery(
      Types.FetchSearchPost,
      makeFetchSaga({ fetchSaga: fetchSearchPost, canCache: false })
    ),
  ]);
}
