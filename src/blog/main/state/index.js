import {
  createReducer,
  createSetValueAction, FETCH_KEY,
  setValueReducer,
} from "../../../common/redux-helper";

export const Types = {
  SetValue: "main/SetValue",
  FetchAllPost: "main/FetchAllPost",
  FetchHashtagPost: "main/FetchHashtagPost",
  FetchSearchPost: "main/FetchSearchPost",
  FetchAllSeries: "main/FetchAllSeries",
  FetchAllHashtag: "main/FetchAllHashtag",
};

export const actions = {
  setValue: createSetValueAction(Types.SetValue),
  fetchAllPost: ({ post = [], totalCount = 0, hashtag = null, search = null, nickname = null }) => ({
    type: Types.FetchAllPost,
    post,
    hashtag,
    search,
    nickname,
    totalCount,
    [FETCH_KEY]: nickname
  }),
  fetchAllSeries: ({ series = [], totalCount = 0, nickname = null }) => ({
    type: Types.FetchAllSeries,
    series,
    nickname,
    totalCount,
    [FETCH_KEY]: nickname
  }),
  fetchAllHashtag: ({nickname = null}) => ({
    type: Types.FetchAllHashtag,
    [FETCH_KEY]: nickname
  }),
};
const INITINAL_STATE = {
  keyword: "",
  autoCompletes: [],
  post: {},
  hashtag: {},
  hashtagCurrent: {},
  searchCurrent: {},
  series: {},
  activeKey: {},
  sideActiveKey: {},
};

const reducer = createReducer(INITINAL_STATE, {
  [Types.SetValue]: setValueReducer,
});
export default reducer;
