import {
  createReducer,
  createSetValueAction,
  FETCH_KEY,
  setValueReducer,
} from "../../../common/redux-helper";

export const Types = {
  SetValue: "post/SetValue",
  SetComment: "post/SetComment",
  FetchGetPost: "post/FetchGetPost",
  FetchAddPostLike: "post/FetchAddPostLike",
  FetchRemovePostLike: "post/FetchRemovePostLike",
  FetchGetZeroLevelComment: "post/FetchGetZeroLevelComment",
  FetchGetComment: "post/FetchGetComment",
  FetchAddComment: "post/FetchAddComment",
  FetchAddZeroLevelComment: "post/FetchAddZeroLevelComment",
  FetchUpdateComment: "post/FetchUpdateComment",
  FetchRemoveComment: "post/FetchRemoveComment",
};

export const actions = {
  setValue: createSetValueAction(Types.SetValue),
  fetchGetPost: (id) => ({
    type: Types.FetchGetPost,
    id: id,
    [FETCH_KEY]: id,
  }),
  setComment: (comment) => ({
    type: Types.SetComment,
    comment,
  }),
  fetchAddPostLike: (id) => ({
    type: Types.FetchAddPostLike,
    id: id,
    [FETCH_KEY]: id,
  }),
  fetchRemovePostLike: (id) => ({
    type: Types.FetchRemovePostLike,
    id: id,
    [FETCH_KEY]: id,
  }),
  fetchGetZeroLevelComment: (postId, comment) => ({
    type: Types.FetchGetZeroLevelComment,
    postId,
    comment,
    [FETCH_KEY]: postId,
  }),
  fetchGetComment: (id, fetchKey) => ({
    type: Types.FetchGetComment,
    postId: id,
    [FETCH_KEY]: fetchKey,
  }),
  fetchAddComment: ({ postId, parentId, commentContent, commentDepth, comment }) => ({
    type: Types.FetchAddComment,
    postId: postId,
    parentId: parentId,
    commentContent,
    commentDepth,
    comment,
    [FETCH_KEY]: postId,
  }),
  fetchAddZeroLevelComment: ({ postId, parentId, commentContent, commentDepth, comment }) => ({
    type: Types.FetchAddZeroLevelComment,
    postId: postId,
    parentId: parentId,
    commentContent,
    commentDepth,
    comment,
    [FETCH_KEY]: postId,
  }),
  fetchUpdateComment: (id, comment) => ({
    type: Types.FetchUpdateComment,
    id: id,
    comment: comment,
    [FETCH_KEY]: id,
  }),
  fetchRemoveComment: (id) => ({
    type: Types.FetchRemoveComment,
    id: id,
    [FETCH_KEY]: id,
  }),
};

const INITIAL_STATE = {
  post: null,
  comment: [],
};
const reducer = createReducer(INITIAL_STATE, {
  [Types.SetValue]: setValueReducer,
});
export default reducer;
