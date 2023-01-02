import {
  createReducer,
  createSetValueAction,
  setValueReducer,
} from "../../../common/redux-helper";

export const Types = {
  SetValue: "like/SetValue",
  FetchAllPost: "like/FetchAllPost",
};

export const actions = {
  setValue: createSetValueAction(Types.SetValue),
  fetchAllPost: (post, totalCount = 0, hashtag = null, search = null) => ({
    type: Types.FetchAllPost,
    post,
    hashtag,
    search,
    totalCount,
  }),
};
const INITINAL_STATE = {
  post: [],
};

const reducer = createReducer(INITINAL_STATE, {
  [Types.SetValue]: setValueReducer,
});
export default reducer;
