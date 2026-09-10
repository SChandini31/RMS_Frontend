export function getFriendlyError(
  error,
  fallback = "Something went wrong. Please try again."
) {
  const raw =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    (typeof error?.message === "string"
      ? error.message
      : "");

  if (typeof raw !== "string") {
    return fallback;
  }

  const cleaned = raw
    .replace(/^[✅❌⚠️]\s*/, "")
    .trim();

  if (!cleaned || cleaned.length > 180) {
    return fallback;
  }

  if (/html|exception|stack trace|sql|etag/i.test(cleaned)) {
    return fallback;
  }

  return cleaned;
}