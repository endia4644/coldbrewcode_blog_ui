import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

/**
 * 
 * @description 메인화면으로 이동시키는 콜백함수를 리턴
 */
export const useGoMain = () => {
  const navigate = useNavigate();
  return useCallback(
    () => {
      navigate("/blog");
    }, [navigate]
  );
}