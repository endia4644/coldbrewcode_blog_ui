import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { AuthStatus } from "../../../common/constant";

export default function useBlockLoginUser(returnUrl = null) {
  const navigate = useNavigate();
  const status = useSelector((state) => state.auth.status);
  useEffect(() => {
    if (status === AuthStatus.Login) {
      navigate(returnUrl ?? "/blog");
    }
  }, [status, navigate, returnUrl]);
}
