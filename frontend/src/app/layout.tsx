import type { Metadata } from "next";
import Providers from "@/components/Providers";
import AOSProvider from "@/components/AOSProvider";
import "./globals.css";
import "@/lib/hint.min.css";

export const metadata: Metadata = {
  title: "Annie's Portfolio",
  description: "Annie's full-stack developer portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AOSProvider />
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          <img
            src="/shape-76.svg"
            alt=""
            className="floating-orb images glow"
            aria-hidden="true"
          />
        </div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
