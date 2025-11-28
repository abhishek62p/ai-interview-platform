import Vapi from "@vapi-ai/web";

const token = process.env.NEXT_PUBLIC_VAPI_TOKEN;

if (!token) {
  // Provide a clear, non-fatal signal in the browser console
  // so users know why voice calls may fail.
  // Do not expose any secrets here.
  console.error(
    "Vapi: NEXT_PUBLIC_VAPI_TOKEN is not set. Voice calls will fail until this is provided in .env and the dev server is restarted."
  );
}

// Instantiate even if token is empty to avoid undefined crashes; the SDK
// will surface a clear auth error on first use.
export const vapi = new Vapi(token || "");