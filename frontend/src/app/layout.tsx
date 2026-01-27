import type { Metadata } from "next";
import { Auth0Provider } from "@auth0/nextjs-auth0/client";
import Particles from "@/components/Particles";
import "./globals.css";

export const metadata: Metadata = {
  title: "Auth0 Next.js App",
  description: "Next.js app with Auth0 authentication",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
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
          <Particles
            particleColors={["#ffffff"]}
            particleCount={30}
            particleSpread={10}
            speed={0.05}
            particleBaseSize={200}
            moveParticlesOnHover
            alphaParticles={false}
            disableRotation={true}
            pixelRatio={1}
          />
        </div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <Auth0Provider>{children}</Auth0Provider>
        </div>
      </body>
    </html>
  );
}
