import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLayoutEffect } from "react";
import { NOT_FIND } from "../../../common/constant";
export default function useBlockLNotEmail() {
  const navigate = useNavigate();
  const email = useSelector((state) => state.auth.email);
  useLayoutEffect(() => {
    if (email === NOT_FIND) {
      navigate("/blog");
    }
  }, [email, navigate]);
}
