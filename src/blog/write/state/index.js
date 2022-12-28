import {
  createReducer,
  createSetValueAction,
  setValueReducer,
} from "../../../common/redux-helper";

export const Types = {
  SetValue: "write/SetValue",
  FetchPost: "write/FetchPost",
  FetchCreatePost: "write/FetchCreatePost",
  FetchUpdatePost: "write/FetchUpdatePost",
  FetchAllSeries: "write/FetchAllSeries",
  FetchCreateSeries: "write/FetchCreateSeries",
};

export const actions = {
  setValue: createSetValueAction(Types.SetValue),
  fetchPost: (id) => ({
    type: Types.FetchPost,
    id,
  }),
  fetchUpdatePost: ({ postId,
    postName,
    hashtags,
    postDescription,
    postContent,
    postThumnail,
    permission,
    seriesOriId,
    seriesOriName,
    seriesName,
    imageIds }) => ({
      type: Types.FetchUpdatePost,
      postId,
      postName,
      hashtags,
      postDescription,
      postContent,
      postThumnail,
      permission,
      seriesOriId,
      seriesOriName,
      seriesName,
      imageIds,
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
