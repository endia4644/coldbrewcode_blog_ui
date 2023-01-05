import {
  createReducer,
  createSetValueAction,
  FETCH_KEY,
  setValueReducer,
} from "../../../common/redux-helper";

export const Types = {
  SetValue: "temp/SetValue",
  FetchAllPost: "temp/FetchAllPost",
  FetchWritePost: "temp/FetchWritePost",
  FetchDeleteTempPost: "temp/FetchDeleteTempPost",
};

export const actions = {
  setValue: createSetValueAction(Types.SetValue),
  fetchAllPost: (post, totalCount = 0) => ({
    type: Types.FetchAllPost,
    post,
    totalCount,
  }),
  fetchWritePost: ({ id }) => ({
    type: Types.FetchWritePost,
    id,
    [FETCH_KEY]: id
  }),
  fetchDeleteTempPost: ({ id, post }) => ({
    type: Types.FetchDeleteTempPost,
    id,
    post,
    [FETCH_KEY]: id
  }),
};
const INITINAL_STATE = {
  post: [],
};

const reducer = createReducer(INITINAL_STATE, {
  [Types.SetValue]: setValueReducer,
});
export default reducer;
