// dotenv is already configured in index.js

function sanitizeMongoUri(uri) {
  try {
    if (!uri || typeof uri !== "string") return uri;
    if (!uri.startsWith("mongodb+srv://")) return uri;
    const prefix = "mongodb+srv://";
    const rest = uri.slice(prefix.length);
    const atIndex = rest.lastIndexOf("@");
    if (atIndex === -1) return uri;
    const credentialsPart = rest.slice(0, atIndex);
    const hostAndParams = rest.slice(atIndex + 1);
    const colonIndex = credentialsPart.indexOf(":");
    if (colonIndex === -1) return uri;
    const username = credentialsPart.slice(0, colonIndex);
    const password = credentialsPart.slice(colonIndex + 1);
    const encodedPassword = /%[0-9A-Fa-f]{2}/.test(password)
      ? password
      : encodeURIComponent(password);
    return `${prefix}${username}:${encodedPassword}@${hostAndParams}`;
  } catch (_e) {
    return uri;
  }
}

export function getMongoUri() {
  const rawUri = process.env.MONGODB_URI?.trim();
  if (!rawUri) {
    throw new Error(
      "Missing MONGODB_URI. Set it in your environment or backend/.env before running this command."
    );
  }
  return sanitizeMongoUri(rawUri);
}

export { sanitizeMongoUri };


