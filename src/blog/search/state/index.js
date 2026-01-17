import {
  createReducer,
  createSetValueAction,
  setValueReducer,
} from "../../../common/redux-helper";

export const Types = {
  SetValue: "search/SetValue",
  FetchSearchPost: "search/FetchSearchPost",
};

export const actions = {
  setValue: createSetValueAction(Types.SetValue),
  fetchSearchPost: ({ post = [], totalCount = 0, nickname = null, search = null }) => ({
    type: Types.FetchSearchPost,
    post,
    nickname,
    search,
    totalCount,
  }),
};
const INITINAL_STATE = {
  keyword: "",
  nickname: "",
  autoCompletes: [],
  post: [],
};

const reducer = createReducer(INITINAL_STATE, {
  [Types.SetValue]: setValueReducer,
});
export default reducer;
