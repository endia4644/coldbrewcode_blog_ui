import { AuthStatus, NOT_FIND } from "../../../common/constant";
import {
  createReducer,
  createSetValueAction,
  setValueReducer,
} from "../../../common/redux-helper";

export const Types = {
  SetValue: "auth/SetValue",
  FetchLogin: "auth/FetchLogin",
  SetUser: "auth/SetUser",
  FetchSignup: "auth/FetchSignup",
  FetchUser: "auth/FetchUser",
  FetchLogout: "auth/FetchLogout",
  FetchEmail: "auth/FetchEmail",
};

export const actions = {
  setValue: createSetValueAction(Types.SetValue),
  fetchLogin: (email, password) => ({
    type: Types.FetchLogin,
    email,
    password,
  }),
  fetchLogout: () => ({ type: Types.FetchLogout }),
  setUser: (user) => ({
    type: Types.SetUser,
    user,
  }),
  fetchSignup: (user) => ({
    type: Types.FetchSignup,
    user,
  }),
  fetchUser: () => ({
    type: Types.FetchUser,
  }),
  fetchEmail: (email) => ({
    type: Types.FetchEmail,
    email,
  }),
};

const INITIAL_STATE = {
  user: null,
  status: null,
};
const reducer = createReducer(INITIAL_STATE, {
  [Types.SetValue]: setValueReducer,
  [Types.SetUser]: (state, action) => {
    state.user = action.user !== NOT_FIND ? action.user : null;
    state.status =
      action.user && action.user !== NOT_FIND
        ? AuthStatus.Login
        : AuthStatus.NotLogin;
  },
});
export default reducer;
