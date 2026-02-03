export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function getAccessToken(): Promise<string | null> {
  const res = await fetch("/api/token", { cache: "no-store" });
  if (!res.ok) return null;
  const data = (await res.json()) as { accessToken?: string };
  return data.accessToken || null;
}

export async function apiFetch(
  path: string,
  options: RequestInit = {},
  admin: boolean = false
) {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  if (admin) {
    const token = await getAccessToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    cache: "no-store"
  });

  if (!res.ok) {
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const json = await res.json();
      const message =
        json?.error?.message ||
        json?.message ||
        "Request failed";
      const err = new Error(message) as Error & { issues?: any[] };
      if (json?.error?.issues) err.issues = json.error.issues;
      throw err;
    }
    const text = await res.text();
    throw new Error(text || "Request failed");
  }

  if (res.status === 204) return null;
  return res.json();
}
