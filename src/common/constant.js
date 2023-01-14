console.log(process.env.REACT_APP_API_HOST);
export const API_HOST = process.env.REACT_APP_API_HOST;
export const FO_HOST = process.env.REACT_APP_UI_HOST;
export const UPDATE_PATH = process.env.REACT_APP_UPDATE_PATH;
export const FetchStatus = {
  Request: "Request",
  Success: "Success",
  Fail: "Fail",
  Delete: "Delete",
};
export const AuthStatus = {
  Login: "Login",
  NotLogin: "NotLogin",
};

export const NO_SAVE = ["main/FetchHashtagPost", "main/FetchSearchPost"];

export const NOT_FIND = "NOTFIND";