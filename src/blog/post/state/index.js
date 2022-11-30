import {
  createReducer,
  createSetValueAction,
  FETCH_KEY,
  setValueReducer,
} from "../../../common/redux-helper";

export const Types = {
  SetValue: "auth/SetValue",
  FetchGetPost: "auth/FetchGetPost",
};

export const actions = {
  setValue: createSetValueAction(Types.SetValue),
  fetchGetPost: (id) => ({
    type: Types.FetchGetPost,
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
