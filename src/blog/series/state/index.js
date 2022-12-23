import {
  createReducer,
  createSetValueAction,
  FETCH_KEY,
  setValueReducer,
} from "../../../common/redux-helper";

export const Types = {
  SetValue: "series/SetValue",
  FetchSeries: "series/FetchSeries",
  FetchUpdateSeries: "series/FetchUpdateSeries",
};

export const actions = {
  setValue: createSetValueAction(Types.SetValue),
  fetchSeries: ({ id }) => ({
    type: Types.FetchSeries,
    id,
    [FETCH_KEY]: id,
  }),
  fetchUpdateSeries: ({ id, posts }) => ({
    type: Types.FetchUpdateSeries,
    id,
    posts,
  }),
};
const INITINAL_STATE = {
  series: [],
  posts: [],
  updateList: [],
};

const reducer = createReducer(INITINAL_STATE, {
  [Types.SetValue]: setValueReducer,
});
export default reducer;