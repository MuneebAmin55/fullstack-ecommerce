export function extractApiError(error) {
  if (!error) return null;
  if (typeof error === "string") return error;

  if (Array.isArray(error)) {
    return error.filter(Boolean).join(" ");
  }

  if (error.detail) return error.detail;
  if (error.non_field_errors) return error.non_field_errors.join(" ");

  const messages = Object.entries(error).flatMap(([key, value]) => {
    if (typeof value === "string") return [value];
    if (Array.isArray(value)) return value;
    if (typeof value === "object" && value !== null) return Object.values(value).flat();
    return [];
  });

  return messages.filter(Boolean).join(" ") || "Something went wrong. Please try again.";
}
