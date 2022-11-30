import {
  createReducer,
  createSetValueAction,
  FETCH_KEY,
  setValueReducer,
} from "../../../common/redux-helper";

export const Types = {
  SetValue: "auth/SetValue",
  FetchGetPost: "auth/FetchGetPost",
  FetchAddPostLike: "auth/FetchAddPostLike",
  FetchRemovePostLike: "auth/FetchRemovePostLike",
};

export const actions = {
  setValue: createSetValueAction(Types.SetValue),
  fetchGetPost: (id) => ({
    type: Types.FetchGetPost,
    id: id,
    [FETCH_KEY]: id,
  }),
  fetchAddPostLike: (id) => ({
    type: Types.FetchAddPostLike,
    id: id,
    [FETCH_KEY]: id,
  }),
  fetchRemovePostLike: (id) => ({
    type: Types.FetchRemovePostLike,
    id: id,
    [FETCH_KEY]: id,
  }),
};

const INITIAL_STATE = {
  post: null,
};
const reducer = createReducer(INITIAL_STATE, {
  [Types.SetValue]: setValueReducer,
});
export default reducer;
