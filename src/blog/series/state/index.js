import {
  createReducer,
  createSetValueAction,
  FETCH_KEY,
  setValueReducer,
} from "../../../common/redux-helper";

export const Types = {
  SetValue: "series/SetValue",
  FetchSeries: "series/FetchSeries",
};

export const actions = {
  setValue: createSetValueAction(Types.SetValue),
  fetchSeries: ({ id }) => ({
    type: Types.FetchSeries,
    id,
    [FETCH_KEY]: id,
  }),
};
const INITINAL_STATE = {
  series: [],
};

const reducer = createReducer(INITINAL_STATE, {
  [Types.SetValue]: setValueReducer,
});
export default reducer;