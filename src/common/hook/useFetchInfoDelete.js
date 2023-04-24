import { useCallback } from "react";
import { FetchStatus } from "../constant";
import { useDispatch } from "react-redux";
import { actions as common } from "../../common/state";

export const useFetchInfoDelete = () => {
  const dispatch = useDispatch();
  return useCallback(
    (actionType, fetchKey) => {
      if (!fetchKey) fetchKey = actionType;
      const params = {
        actionType,
        fetchKey,
        status: FetchStatus.Delete,
      };
      dispatch(common.setFetchStatus(params));
    },
    [dispatch]
  )
};