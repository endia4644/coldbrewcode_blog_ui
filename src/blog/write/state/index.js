import {
  createReducer,
  createSetValueAction,
  setValueReducer,
} from "../../../common/redux-helper";

export const Types = {
  SetValue: "write/SetValue",
  FetchCreatePost: "write/FetchCreatePost",
  FetchUpdatePost: "write/FetchUpdatePost",
  FetchAllSeries: "write/FetchAllSeries",
  FetchCreateSeries: "write/FetchCreateSeries",
};

export const actions = {
  setValue: createSetValueAction(Types.SetValue),
  fetchUpdatePost: (postId, postName, description, htmlContent) => ({
    type: Types.FetchUpdatePost,
    postId,
    postName,
    description,
    htmlContent,
  }),
  fetchCreatePost: ({
    postName,
    hashtags,
    postDescription,
    postContent,
    postThumnail,
    permission,
    seriesName,
    imageIds,
  }) => ({
    type: Types.FetchCreatePost,
    postName,
    hashtags,
    postDescription,
    postContent,
    postThumnail,
    permission,
    seriesName,
    imageIds,
  }),
  fetchAllSeries: () => ({
    type: Types.FetchAllSeries,
  }),
  fetchCreateSeries: (seriesName) => ({
    type: Types.FetchCreateSeries,
    seriesName,
  }),
};
const INITINAL_STATE = {
  postName: "",
  postContent: "",
  hashtag: [],
  seriesList: [],
  imageList: [],
};

const reducer = createReducer(INITINAL_STATE, {
  [Types.SetValue]: setValueReducer,
});
export default reducer;
