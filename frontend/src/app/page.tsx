"use client";

import { useState } from "react";
import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0/client";
import LoginButton from "@/components/auth/LoginButton";
import LogoutButton from "@/components/auth/LogoutButton";
import CircularText from "@/components/CircularText";

type TabType = "about" | "projects" | "testimonials";

export default function Home() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<TabType>("about");

  return (
    <div className="app-container">
      <div className="portfolio-wrapper">
        {/* LEFT SIDEBAR - PROFILE */}
        <div className="profile-sidebar">
          <div className="profile-header">
            <div
              style={{
                position: "relative",
                width: "200px",
                height: "200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                top: "-40px",
              }}
            >
              <CircularText text="helloo" spinDuration={50} onHover="speedUp" />
              <Image
                src={user?.picture || "https://via.placeholder.com/120"}
                alt="Profile"
                className="profile-image-small"
                width={120}
                height={120}
                style={{ position: "absolute", zIndex: 10 }}
              />
            </div>

            <div className="profile-name-section">
              <div className="profile-name-row">
                <h1 className="profile-name">{user?.name || "Your Name"}</h1>
                <button className="get-in-touch-btn">Get in Touch</button>
              </div>
              <p className="profile-role">Full-stack Developer</p>
            </div>
          </div>

          <div className="profile-info">
            <div
              style={{
                padding: "1.25rem",
                background: "rgb(110, 156, 255)",
                borderRadius: "16px",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                width: "600px",
                minHeight: "150px",
                marginTop: "-40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <p className="bio" style={{ margin: 0 }}>
                This is textThis is textThis is textThis is textThis is textThis
                is textThis is textThis is textThis is textThis is textThis is
                textThis is textThis is textThis is textThis is textThis is
                textThis is textThis is textThis is textThis is textThis is
                textThis is textThis is textThis is textThis is textThis is
                textThis is textThis is textThis is text textThis is textThis is
                textThis is texttextThis is textThis is textThis is texttextThis
                is textThis is textThis is texttextThis is textThis is textThis
                is texttextThis is textThis is textThis is texttextThis is
                textThis is textThis is texttextThis is textThis is textThis is
                texttextThis is textThis is textThis is texttextThis is textThis
                is textThis is text
              </p>
            </div>

            <a
              href="https://instagram.com"
              className="social-handle"
              target="_blank"
              rel="noopener noreferrer"
            >
              random+link
            </a>

            <div className="social-links">
              <a
                href="https://github.com"
                className="social-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com"
                className="social-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              <a
                href="https://twitter.com"
                className="social-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                CV
              </a>
            </div>

            {user && <LogoutButton />}
            {!user && <LoginButton />}
          </div>
        </div>

        {/* RIGHT SIDE - CONTENT */}
        <div className="content-area">
          {/* NAVIGATION TABS */}
          <div className="nav-tabs">
            <button
              className={`nav-tab ${activeTab === "about" ? "active" : ""}`}
              onClick={() => setActiveTab("about")}
            >
              About Me
            </button>
            <button
              className={`nav-tab ${activeTab === "projects" ? "active" : ""}`}
              onClick={() => setActiveTab("projects")}
            >
              Projects
            </button>
            <button
              className={`nav-tab ${activeTab === "testimonials" ? "active" : ""}`}
              onClick={() => setActiveTab("testimonials")}
            >
              Testimonials
            </button>
          </div>

          {/* CONTENT PANEL */}
          <div className="content-panel">
            {activeTab === "about" && (
              <div>
                <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>
                  About Me
                </h2>
                <p style={{ color: "#e0e0e0", lineHeight: "1.8" }}>
                  I&apos;m a full-stack developer with expertise in React,
                  Next.js, TypeScript, and Node.js. I love building applications
                  that combine beautiful design with robust functionality.
                </p>
              </div>
            )}

            {activeTab === "projects" && (
              <div>
                <h2 style={{ fontSize: "1.8rem", marginBottom: "1.5rem" }}>
                  My Projects
                </h2>
                <div
                  style={{
                    display: "grid",
                    gap: "1.5rem",
                    gridTemplateColumns: "1fr",
                  }}
                >
                  <div
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      borderRadius: "18px",
                      overflow: "hidden",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "350px",
                      }}
                    >
                      <Image
                        src="https://via.placeholder.com/900x600"
                        alt="Project One preview"
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div style={{ padding: "0.9rem 1rem 1.1rem" }}>
                      <h3 style={{ margin: "0 0 0.4rem 0", fontSize: "1rem" }}>
                        Project One
                      </h3>
                      <p
                        style={{
                          margin: 0,
                          color: "#e0e0e0",
                          lineHeight: "1.5",
                        }}
                      >
                        Brief description of your first project. Highlight the
                        tech stack and impact.
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      borderRadius: "18px",
                      overflow: "hidden",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "350px",
                      }}
                    >
                      <Image
                        src="https://via.placeholder.com/900x600"
                        alt="Project Two preview"
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div style={{ padding: "0.9rem 1rem 1.1rem" }}>
                      <h3 style={{ margin: "0 0 0.4rem 0", fontSize: "1rem" }}>
                        Project Two
                      </h3>
                      <p
                        style={{
                          margin: 0,
                          color: "#e0e0e0",
                          lineHeight: "1.5",
                        }}
                      >
                        Brief description of your second project. Mention
                        outcomes and what you built.
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      borderRadius: "18px",
                      overflow: "hidden",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "350px",
                      }}
                    >
                      <Image
                        src="https://via.placeholder.com/900x600"
                        alt="Project Three preview"
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div style={{ padding: "0.9rem 1rem 1.1rem" }}>
                      <h3 style={{ margin: "0 0 0.4rem 0", fontSize: "1rem" }}>
                        Project Three
                      </h3>
                      <p
                        style={{
                          margin: 0,
                          color: "#e0e0e0",
                          lineHeight: "1.5",
                        }}
                      >
                        Brief description of your third project. Mention
                        outcomes and what you built.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "testimonials" && (
              <div>
                <h2 style={{ fontSize: "1.8rem", marginBottom: "1.5rem" }}>
                  Testimonials
                </h2>
                <div
                  style={{
                    padding: "1.5rem",
                    background: "rgba(255, 255, 255, 0.08)",
                    borderRadius: "12px",
                    borderLeft: "4px solid #ffffff",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: "#e0e0e0",
                      fontSize: "0.95rem",
                      lineHeight: "1.8",
                    }}
                  >
                    &quot;Great developer to work with. Delivered on time and
                    exceeded expectations.&quot;
                  </p>
                  <p
                    style={{
                      margin: "1rem 0 0 0",
                      color: "#ffffff",
                      fontWeight: "600",
                    }}
                  >
                    — Client Name
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
