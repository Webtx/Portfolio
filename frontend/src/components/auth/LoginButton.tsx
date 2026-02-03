"use client";

export default function LoginButton({ returnTo }: { returnTo?: string }) {
  const href = returnTo ? `/auth/login?returnTo=${encodeURIComponent(returnTo)}` : "/auth/login";

  return (
    <a href={href} className="button login">
      Log In
    </a>
  );
}
