import {
  createReducer,
  createSetValueAction,
  FETCH_KEY,
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
  FetchTempPost: "write/FetchTempPost",
  FetchDeleteTempPost: "write/FetchDeleteTempPost"
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
    imageIds,
    tempId }) => ({
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
      tempId,
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
    tempId,
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
    tempId,
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
  fetchTempPost: ({ id, postId }) => ({
    type: Types.FetchTempPost,
    id,
    postId,
  }),
  fetchDeleteTempPost: ({ id }) => ({
    type: Types.FetchDeleteTempPost,
    id,
    [FETCH_KEY]: id
  }),
};
export const INITINAL_STATE = {
  post: null,
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
  postType: "post",
  tempId: "",
};

const reducer = createReducer(INITINAL_STATE, {
  [Types.SetValue]: setValueReducer,
});
export default reducer;
