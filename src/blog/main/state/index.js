import { createReducer, createSetValueAction, setValueReducer } from "../../../common/redux-helper";

export const Types = {
  SetValue: 'main/SetValue',
  FetchAutoComplete: 'main/FetchAutoComplete',
  FetchAllPost: 'main/FetchAllPost',
};

export const actions = {
  setValue: createSetValueAction(Types.SetValue),
  fetchAutoComplete: keyword => ({
    type: Types.FetchAutoComplete,
    keyword
  }),
  fetchAllPost: (post, totalCount = 0) => ({
    type: Types.FetchAllPost,
    post,
    totalCount
  }),
}

const INITINAL_STATE = {
  keyword: '',
  autoCompletes: [],
  post: [],
}

const reducer = createReducer(INITINAL_STATE, {
  [Types.SetValue]: setValueReducer,
})
export default reducer;