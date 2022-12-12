import {
  createReducer,
  createSetValueAction,
  setValueReducer,
} from "../../../common/redux-helper";

export const Types = {
  SetValue: "series/SetValue",
  FetchAllSeries: "series/FetchAllSeries",
};

export const actions = {
  setValue: createSetValueAction(Types.SetValue),
  fetchAllSeries: (id, series) => ({
    type: Types.FetchAllSeries,
    id,
    series,
  }),
};
const INITINAL_STATE = {
  series: [],
};

const reducer = createReducer(INITINAL_STATE, {
  [Types.SetValue]: setValueReducer,
});
export default reducer;
