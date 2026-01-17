import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {useSelector} from "react-redux";

/**
 * 
 * @description 유저 블로그 메인화면으로 이동시키는 콜백함수를 리턴
 */
export const useGoMyBlogMain = () => {
  const user = useSelector(state => state.auth.user);
  const navigate = useNavigate();
  return useCallback(
    () => {
      navigate(`/blog/@${user?.nickName}`);
    }, [navigate, user]
  );
}