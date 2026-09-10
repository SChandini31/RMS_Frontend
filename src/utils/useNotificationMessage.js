import { useCallback } from "react";

import { useNotification } from "../context/NotificationContext";
import { getFriendlyError } from "./notifyError";

function getNotificationDetails(message, customTitle) {
  const text =
    typeof message === "string"
      ? message
      : "Something went wrong. Please try again.";

  const normalized = text.toLowerCase();

  const isError =
    /failed|error|unable|invalid|could not|cannot|rejected/.test(
      normalized
    );

  const isSuccess =
    /successfully|success|downloaded|completed|created|updated|approved|submitted/.test(
      normalized
    );

  return {
    type: isError
      ? "error"
      : isSuccess
        ? "success"
        : "warning",

    title:
      customTitle ||
      (isError
        ? "Action Failed"
        : isSuccess
          ? "Action Successful"
          : "Validation Required"),

    message: text
      .replace(/^[✅❌⚠️]\s*/, "")
      .trim(),
  };
}

export function useNotificationMessage() {
  const { showNotification } = useNotification();

  return useCallback(
    (message, fallback, customTitle) => {
      const friendlyMessage = fallback
        ? getFriendlyError(message, fallback)
        : message;

      const details = getNotificationDetails(
        friendlyMessage,
        customTitle
      );

      showNotification(
        details.type,
        details.title,
        details.message
      );
    },
    [showNotification]
  );
}