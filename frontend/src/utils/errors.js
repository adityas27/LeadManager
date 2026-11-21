const LEAD_FIELDS = new Set(["name", "email", "phone", "company", "source", "status"]);

function asMessage(value) {
  if (Array.isArray(value)) return value.map(String).join(" ");
  if (value && typeof value === "object") return Object.values(value).map(asMessage).join(" ");
  return String(value ?? "");
}

export function parseApiErrors(error) {
  const unreachable = "Cannot reach the server. Start the API and try again.";
  const fallback = "Something went wrong. Please try again.";

  if (!error?.response) {
    return { fieldErrors: {}, form: unreachable };
  }

  const data = error.response.data;
  if (!data || typeof data === "string") {
    return {
      fieldErrors: {},
      form: typeof data === "string" && data.trim() ? data : fallback,
    };
  }

  if (typeof data.detail === "string") {
    return { fieldErrors: {}, form: data.detail };
  }

  const fieldErrors = {};
  const formMessages = [];

  Object.entries(data).forEach(([key, value]) => {
    const message = asMessage(value);
    if (!message) return;
    if (LEAD_FIELDS.has(key)) fieldErrors[key] = message;
    else formMessages.push(message);
  });

  return {
    fieldErrors,
    form: formMessages.join(" "),
  };
}
