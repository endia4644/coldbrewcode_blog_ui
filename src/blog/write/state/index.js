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
  FetchCreateTempPost: "write/FetchCreateTempPost",
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
    postThumbnail,
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
      postThumbnail,
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
    postThumbnail,
    permission,
    seriesName,
    imageIds,
  }) => ({
    type: Types.FetchCreatePost,
    postName,
    hashtags,
    postDescription,
    postContent,
    postThumbnail,
    permission,
    seriesName,
    imageIds,
  }),
  fetchCreateTempPost: ({
    postId,
    postName,
    hashtags,
    postDescription,
    postContent,
    postThumbnail,
    permission,
    seriesName,
    imageIds,
  }) => ({
    type: Types.FetchCreateTempPost,
    postId,
    postName,
    hashtags,
    postDescription,
    postContent,
    postThumbnail,
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
export const INITINAL_STATE = {
  postName: "",
  postContent: "",
  hashtag: [],
  postDescription: "",
  postThumbnail: "",
  permission: "public",
  seriesName: "",
  seriesList: [],
  imageList: [],
  thumbnailId: "",
};

const reducer = createReducer(INITINAL_STATE, {
  [Types.SetValue]: setValueReducer,
});
export default reducer;
