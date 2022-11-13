import { createReducer, createSetValueAction, setValueReducer } from "../../../common/redux-helper";

export const Types = {
  SetValue: 'main/SetValue',
  FetchCreatePost: 'main/FetchCreatePost',
  FetchUpdatePost: 'main/FetchUpdatePost',
};

export const actions = {
  setValue: createSetValueAction(Types.SetValue),
  fetchUpdatePost: (postId, postName, description, htmlContent) => ({
    type: Types.FetchUpdatePost,
    postId,
    postName,
    description,
    htmlContent
  }),
  fetchCreatePost: (postName, description, htmlContent) => ({
    type: Types.FetchCreatePost,
    postName,
    description,
    htmlContent
  }),
}
const INITINAL_STATE = {

}

const reducer = createReducer(INITINAL_STATE, {
  [Types.SetValue]: setValueReducer,
})
export default reducer;