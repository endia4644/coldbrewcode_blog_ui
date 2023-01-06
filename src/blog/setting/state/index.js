import {
  createReducer,
  createSetValueAction,
  setValueReducer,
} from "../../../common/redux-helper";

export const Types = {
  SetValue: "setting/SetValue",
  FetchDeleteProfileImg: "setting/FetchDeleteProfileImg",
  FetchCreateProfileImg: "setting/FetchCreateProfileImg",
  FetchUpdateNickName: "setting/FetchUpdateNickName"
};

export const actions = {
  setValue: createSetValueAction(Types.SetValue),
  fetchCreateProfileImg: ({ formData, fileBlob }) => ({
    type: Types.FetchCreateProfileImg,
    formData,
    fileBlob
  }),
  fetchDeleteProfileImg: () => ({
    type: Types.FetchDeleteProfileImg,
  }),
  fetchUpdateNickName: ({ nickName }) => ({
    type: Types.FetchUpdateNickName,
    nickName
  }),
};
const INITINAL_STATE = {
  profileImg: null,
  nickNameUpdate: false,
  nickName: "",
};

const reducer = createReducer(INITINAL_STATE, {
  [Types.SetValue]: setValueReducer,
});
export default reducer;
