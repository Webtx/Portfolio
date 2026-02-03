"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0/client";
import LoginButton from "@/components/auth/LoginButton";
import LogoutButton from "@/components/auth/LogoutButton";
import CircularText from "@/components/CircularText";
import { API_BASE_URL } from "@/lib/api";
import {
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiAngular,
  SiVuedotjs,
  SiSpring,
  SiSpringboot,
  SiDotnet,
  SiPython,
  SiHtml5,
  SiCss3,
  SiTailwindcss,
  SiPostgresql,
  SiMysql,
  SiSqlite,
  SiLinux,
  SiMongodb,
  SiFigma,
  SiGithub,
  SiGit,
  SiPhp,
  SiPhpmyadmin,
  SiKotlin,
  SiSwift,
  SiDocker,
} from "react-icons/si";
import { FaJava, FaDatabase, FaHashtag } from "react-icons/fa";
import { IconType } from "react-icons";

type TabType = "about" | "projects" | "testimonials";
type BilingualText = { en: string; fr: string };

type Skill = {
  id: string;
  name: BilingualText;
  level?: number | null;
  category?: BilingualText | null;
};

type Experience = {
  id: string;
  company: BilingualText;
  role: BilingualText;
  description: BilingualText;
  startDate: string;
  endDate?: string | null;
  isCurrent?: boolean | null;
  location?: BilingualText | null;
};

type Education = {
  id: string;
  school: BilingualText;
  degree: BilingualText;
  field?: BilingualText | null;
  description?: BilingualText | null;
  startDate: string;
  endDate?: string | null;
};

type Hobby = {
  id: string;
  name: BilingualText;
  description?: BilingualText | null;
};

const iconMap: Record<string, IconType> = {
  javascript: SiJavascript,
  js: SiJavascript,
  typescript: SiTypescript,
  ts: SiTypescript,
  react: SiReact,
  reactjs: SiReact,
  next: SiNextdotjs,
  nextjs: SiNextdotjs,
  node: SiNodedotjs,
  nodejs: SiNodedotjs,
  angular: SiAngular,
  vue: SiVuedotjs,
  vuejs: SiVuedotjs,
  spring: SiSpring,
  springboot: SiSpringboot,
  dotnet: SiDotnet,
  dotnetcore: SiDotnet,
  netcore: SiDotnet,
  java: FaJava,
  csharp: FaHashtag,
  python: SiPython,
  html: SiHtml5,
  html5: SiHtml5,
  css: SiCss3,
  css3: SiCss3,
  tailwind: SiTailwindcss,
  tailwindcss: SiTailwindcss,
  postgres: SiPostgresql,
  postgresql: SiPostgresql,
  mysql: SiMysql,
  sqlite: SiSqlite,
  linux: SiLinux,
  mongodb: SiMongodb,
  figma: SiFigma,
  github: SiGithub,
  git: SiGit,
  php: SiPhp,
  phpmyadmin: SiPhpmyadmin,
  kotlin: SiKotlin,
  swift: SiSwift,
  sql: FaDatabase,
  mssql: FaDatabase,
  sqlserver: FaDatabase,
  mssqldatabase: FaDatabase,
  docker: SiDocker,
};

const iconColorMap: Record<string, string> = {
  javascript: "#F7DF1E",
  js: "#F7DF1E",
  typescript: "#3178C6",
  ts: "#3178C6",
  react: "#61DAFB",
  reactjs: "#61DAFB",
  next: "#FFFFFF",
  nextjs: "#FFFFFF",
  node: "#339933",
  nodejs: "#339933",
  angular: "#DD0031",
  vue: "#4FC08D",
  vuejs: "#4FC08D",
  spring: "#6DB33F",
  springboot: "#6DB33F",
  dotnet: "#512BD4",
  dotnetcore: "#512BD4",
  netcore: "#512BD4",
  java: "#007396",
  csharp: "#512BD4",
  python: "#3776AB",
  html: "#E34F26",
  html5: "#E34F26",
  css: "#1572B6",
  css3: "#1572B6",
  tailwind: "#06B6D4",
  tailwindcss: "#06B6D4",
  postgres: "#336791",
  postgresql: "#336791",
  mysql: "#4479A1",
  sqlite: "#003B57",
  linux: "#FCC624",
  mongodb: "#47A248",
  figma: "#F24E1E",
  github: "#FFFFFF",
  git: "#F05032",
  php: "#777BB4",
  phpmyadmin: "#6C78AF",
  kotlin: "#7F52FF",
  swift: "#F05138",
  sql: "#336791",
  mssql: "#CC2927",
  sqlserver: "#CC2927",
  mssqldatabase: "#CC2927",
  docker: "#2496ED",
};

function normalizeSkillKey(name?: string) {
  if (!name) return "";
  return name
    .trim()
    .toLowerCase()
    .replace(/#/g, "sharp")
    .replace(/\+/g, "plus")
    .replace(/[\s.]/g, "");
}

function getSkillIcon(name?: string) {
  if (!name) return null;
  const key = normalizeSkillKey(name);
  return iconMap[key] || null;
}

function getSkillIconColor(name?: string) {
  if (!name) return undefined;
  const key = normalizeSkillKey(name);
  return iconColorMap[key];
}

export default function Home() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<TabType>("about");
  const [lang, setLang] = useState<"en" | "fr">("en");
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [loadingAbout, setLoadingAbout] = useState(false);

  const loadAbout = async () => {
    setLoadingAbout(true);
    try {
      const [skillsRes, expRes, eduRes, hobbyRes] = await Promise.all([
        fetch(`${API_BASE_URL}/public/skills`, { cache: "no-store" }),
        fetch(`${API_BASE_URL}/public/experiences`, { cache: "no-store" }),
        fetch(`${API_BASE_URL}/public/education`, { cache: "no-store" }),
        fetch(`${API_BASE_URL}/public/hobbies`, { cache: "no-store" }),
      ]);

      const skillsData = await skillsRes.json();
      const expData = await expRes.json();
      const eduData = await eduRes.json();
      const hobbyData = await hobbyRes.json();

      setSkills(Array.isArray(skillsData) ? skillsData : []);
      setExperiences(Array.isArray(expData) ? expData : []);
      setEducation(Array.isArray(eduData) ? eduData : []);
      setHobbies(Array.isArray(hobbyData) ? hobbyData : []);
    } finally {
      setLoadingAbout(false);
    }
  };

  useEffect(() => {
    loadAbout();
  }, []);

  return (
    <>
      {/* TOP HEADER */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "70px",
          background: "rgba(0, 0, 0, 0.98)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: "2rem",
          paddingRight: "2rem",
          zIndex: 100,
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* LEFT: Auth Controls + Language Toggle */}
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          {/* Auth Controls */}
          {user ? <LogoutButton /> : <LoginButton returnTo="/admin" />}

          {/* Language Toggle Switch */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "20px",
              padding: "4px",
              cursor: "pointer",
              gap: "0",
            }}
            onClick={() => setLang(lang === "en" ? "fr" : "en")}
          >
            <button
              style={{
                padding: "0.5rem 1rem",
                background:
                  lang === "en" ? "rgba(255, 255, 255, 1)" : "transparent",
                color: lang === "en" ? "black" : "white",
                border: "none",
                borderRadius: "16px",
                cursor: "pointer",
                fontWeight: "bold",
                transition: "all 0.3s ease",
                fontSize: "0.9rem",
              }}
              onClick={(e) => {
                e.stopPropagation();
                setLang("en");
              }}
            >
              EN
            </button>
            <button
              style={{
                padding: "0.5rem 1rem",
                background:
                  lang === "fr" ? "rgba(255, 255, 255, 1)" : "transparent",
                color: lang === "fr" ? "black" : "white",
                border: "none",
                borderRadius: "16px",
                cursor: "pointer",
                fontWeight: "bold",
                transition: "all 0.3s ease",
                fontSize: "0.9rem",
              }}
              onClick={(e) => {
                e.stopPropagation();
                setLang("fr");
              }}
            >
              FR
            </button>
          </div>
        </div>

        {/* RIGHT: Admin Dashboard */}
        <div>
          {user && (
            <a href="/admin" className="social-btn">
              Admin Dashboard
            </a>
          )}
        </div>
      </div>

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
                <CircularText
                  text="helloo"
                  spinDuration={50}
                  onHover="speedUp"
                />
                <Image
                  src={user?.picture || "/profile.jpg"}
                  alt="Profile"
                  className="profile-image-small"
                  width={120}
                  height={120}
                  style={{ position: "absolute", zIndex: 10 }}
                />
              </div>

              <div className="profile-name-section">
                <div className="profile-name-row">
                  <h1 className="profile-name">{user?.name || "Annie Yang"}</h1>
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
                  This is textThis is textThis is textThis is textThis is
                  textThis is textThis is textThis is textThis is textThis is
                  textThis is textThis is textThis is textThis is textThis is
                  textThis is textThis is textThis is textThis is textThis is
                  textThis is textThis is textThis is textThis is textThis is
                  textThis is textThis is textThis is textThis is text textThis
                  is textThis is textThis is texttextThis is textThis is
                  textThis is texttextThis is textThis is textThis is
                  texttextThis is textThis is textThis is texttextThis is
                  textThis is textThis is texttextThis is textThis is textThis
                  is texttextThis is textThis is textThis is texttextThis is
                  textThis is textThis is texttextThis is textThis is textThis
                  is text
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
                  href="/cv.pdf"
                  className="social-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  CV
                </a>
              </div>
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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "1rem",
                    }}
                  >
                    <h2 style={{ fontSize: "1.8rem", marginBottom: 0 }}>
                      About Me
                    </h2>
                  </div>
                  {loadingAbout && (
                    <p style={{ color: "#e0e0e0", lineHeight: "1.8" }}>
                      Loading your profile...
                    </p>
                  )}
                  {!loadingAbout && (
                    <div style={{ display: "grid", gap: "2rem" }}>
                      <section>
                        <h3 style={{ marginBottom: "0.75rem" }}>Skills</h3>
                        <div
                          style={{
                            display: "flex",
                            gap: "0.75rem",
                            flexWrap: "wrap",
                          }}
                        >
                          {skills.map((skill) => {
                            const label = (skill.name?.[lang] ||
                              skill.name?.en ||
                              "Skill") as string;
                            const Icon = getSkillIcon(label);
                            return (
                              <div
                                key={skill.id}
                                style={{
                                  padding: "0.9rem 1.1rem",
                                  borderRadius: "16px",
                                  border: "1px solid rgba(255, 255, 255, 0.2)",
                                  background: "rgba(255, 255, 255, 0.08)",
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  gap: "0.5rem",
                                  minWidth: "110px",
                                }}
                              >
                                {Icon && (
                                  <Icon
                                    size={28}
                                    color={getSkillIconColor(label)}
                                  />
                                )}
                                <span style={{ fontSize: "0.95rem" }}>
                                  {label}
                                </span>
                              </div>
                            );
                          })}
                          {skills.length === 0 && (
                            <span style={{ color: "#e0e0e0" }}>
                              No skills yet.
                            </span>
                          )}
                        </div>
                      </section>

                      <section>
                        <h3 style={{ marginBottom: "0.75rem" }}>Experience</h3>
                        <div style={{ display: "grid", gap: "1rem" }}>
                          {experiences.map((exp) => (
                            <div
                              key={exp.id}
                              style={{
                                padding: "1rem",
                                borderRadius: "16px",
                                background: "rgba(255, 255, 255, 0.05)",
                                border: "1px solid rgba(255, 255, 255, 0.12)",
                              }}
                            >
                              <div style={{ fontWeight: 700 }}>
                                {
                                  (exp.role?.[lang] ||
                                    exp.role?.en ||
                                    "Role") as string
                                }{" "}
                                -{" "}
                                {
                                  (exp.company?.[lang] ||
                                    exp.company?.en ||
                                    "Company") as string
                                }
                              </div>
                              <div
                                style={{
                                  fontSize: "0.85rem",
                                  color: "#e0e0e0",
                                }}
                              >
                                {exp.startDate?.slice(0, 10)}{" "}
                                {exp.isCurrent
                                  ? "- Present"
                                  : exp.endDate?.slice(0, 10)}
                              </div>
                              <p
                                style={{
                                  marginTop: "0.5rem",
                                  color: "#e0e0e0",
                                }}
                              >
                                {
                                  (exp.description?.[lang] ||
                                    exp.description?.en ||
                                    "") as string
                                }
                              </p>
                            </div>
                          ))}
                          {experiences.length === 0 && (
                            <span style={{ color: "#e0e0e0" }}>
                              No experience yet.
                            </span>
                          )}
                        </div>
                      </section>

                      <section>
                        <h3 style={{ marginBottom: "0.75rem" }}>Education</h3>
                        <div style={{ display: "grid", gap: "1rem" }}>
                          {education.map((edu) => (
                            <div
                              key={edu.id}
                              style={{
                                padding: "1rem",
                                borderRadius: "16px",
                                background: "rgba(255, 255, 255, 0.05)",
                                border: "1px solid rgba(255, 255, 255, 0.12)",
                              }}
                            >
                              <div style={{ fontWeight: 700 }}>
                                {
                                  (edu.degree?.[lang] ||
                                    edu.degree?.en ||
                                    "Degree") as string
                                }{" "}
                                -{" "}
                                {
                                  (edu.school?.[lang] ||
                                    edu.school?.en ||
                                    "School") as string
                                }
                              </div>
                              <div
                                style={{
                                  fontSize: "0.85rem",
                                  color: "#e0e0e0",
                                }}
                              >
                                {edu.startDate?.slice(0, 10)}{" "}
                                {edu.endDate
                                  ? `- ${edu.endDate.slice(0, 10)}`
                                  : ""}
                              </div>
                              {(edu.description?.[lang] ||
                                edu.description?.en) && (
                                <p
                                  style={{
                                    marginTop: "0.5rem",
                                    color: "#e0e0e0",
                                  }}
                                >
                                  {
                                    (edu.description?.[lang] ||
                                      edu.description?.en) as string
                                  }
                                </p>
                              )}
                            </div>
                          ))}
                          {education.length === 0 && (
                            <span style={{ color: "#e0e0e0" }}>
                              No education yet.
                            </span>
                          )}
                        </div>
                      </section>

                      <section>
                        <h3 style={{ marginBottom: "0.75rem" }}>Hobbies</h3>
                        <div
                          style={{
                            display: "flex",
                            gap: "0.75rem",
                            flexWrap: "wrap",
                          }}
                        >
                          {hobbies.map((hobby) => (
                            <span
                              key={hobby.id}
                              style={{
                                padding: "0.4rem 0.8rem",
                                borderRadius: "999px",
                                border: "1px solid rgba(255, 255, 255, 0.2)",
                                background: "rgba(255, 255, 255, 0.08)",
                              }}
                            >
                              {
                                (hobby.name?.[lang] ||
                                  hobby.name?.en ||
                                  "Hobby") as string
                              }
                            </span>
                          ))}
                          {hobbies.length === 0 && (
                            <span style={{ color: "#e0e0e0" }}>
                              No hobbies yet.
                            </span>
                          )}
                        </div>
                      </section>
                    </div>
                  )}
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
                        <h3
                          style={{ margin: "0 0 0.4rem 0", fontSize: "1rem" }}
                        >
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
                        <h3
                          style={{ margin: "0 0 0.4rem 0", fontSize: "1rem" }}
                        >
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
                        <h3
                          style={{ margin: "0 0 0.4rem 0", fontSize: "1rem" }}
                        >
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
                      Client Name
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
