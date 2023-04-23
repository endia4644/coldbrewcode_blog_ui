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
  FetchDeleteSeries: "series/FetchDeleteSeries",
};

export const actions = {
  setValue: createSetValueAction(Types.SetValue),
  fetchSeries: ({ id, order = 'desc' }) => ({
    type: Types.FetchSeries,
    id,
    order,
    [FETCH_KEY]: id,
  }),
  fetchUpdateSeries: ({ id, posts }) => ({
    type: Types.FetchUpdateSeries,
    id,
    posts,
    [FETCH_KEY]: id,
  }),
  fetchDeleteSeries: ({ id }) => ({
    type: Types.FetchDeleteSeries,
    id,
    [FETCH_KEY]: id,
  }),
};
const INITINAL_STATE = {
  series: null,
  posts: [],
  updateList: [],
  order: 'desc'
};

const reducer = createReducer(INITINAL_STATE, {
  [Types.SetValue]: setValueReducer,
});
export default reducer;