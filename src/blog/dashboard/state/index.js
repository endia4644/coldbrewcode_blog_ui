import {
  createReducer,
  createSetValueAction,
  setValueReducer,
} from "../../../common/redux-helper";

export const Types = {
  SetValue: "dashboard/SetValue",
  FetchAllPost: "dashboard/FetchAllPost",
  FetchHashtagPost: "dashboard/FetchHashtagPost",
  FetchSearchPost: "dashboard/FetchSearchPost",
  FetchAllSeries: "dashboard/FetchAllSeries",
  FetchAllHashtag: "dashboard/FetchAllHashtag",
};

export const actions = {
  setValue: createSetValueAction(Types.SetValue),
  fetchAllPost: ({ post = [], totalCount = 0, hashtag = null, search = null }) => ({
    type: Types.FetchAllPost,
    post,
    hashtag,
    search,
    totalCount,
  }),
  fetchAllSeries: ({ series = [], totalCount = 0 }) => ({
    type: Types.FetchAllSeries,
    series,
    totalCount,
  }),
  fetchAllHashtag: () => ({
    type: Types.FetchAllHashtag
  }),
};
const INITINAL_STATE = {
  keyword: "",
  autoCompletes: [],
  post: [],
  hashtag: [],
  hashtagCurrent: "",
  searchCurrent: "",
  series: [],
  activeKey: "trend",
  sideActiveKey: "ALL",
};

const reducer = createReducer(INITINAL_STATE, {
  [Types.SetValue]: setValueReducer,
});
export default reducer;
