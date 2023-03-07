import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useBlocker } from "./useBlocker";

export const useCallbackPrompt = (when) => {
  const location = useLocation();
  const [showPrompt, setShowPrompt] = useState(false);
  const [blockedLocation, setBlockedLocation] = useState(null);

  const cancelNavigation = useCallback(() => {
    setShowPrompt(false);
    setBlockedLocation(null);
  }, []);

  const blocker = useCallback(
    (tx) => {
      const editor = document.getElementsByClassName('ck-editor__editable');
      const contentSize = editor[0]?.childNodes?.length > 1 ? 1 : 0;
      if ((tx.location.pathname !== location.pathname) && contentSize) {
        setBlockedLocation(tx);
        setShowPrompt(true);
      } else {
        tx.retry();
      }
    },
    [location]
  );

  const confirmNavigation = useCallback(() => {
    if (blockedLocation) {
      blockedLocation.retry();
      cancelNavigation(); // 클린업
    }
  }, [blockedLocation]);

  useBlocker(blocker, when);

  return [showPrompt, confirmNavigation, cancelNavigation];
};