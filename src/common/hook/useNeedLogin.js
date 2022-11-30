import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AuthStatus } from "../constant";

export default function useNeedLogin() {
  const navigate = useNavigate();
  const status = useSelector((state) => state.auth.status);
  useEffect(() => {
    if (status === AuthStatus.NotLogin) {
      navigate("/blog/login");
    }
  }, [status, navigate]);
}
