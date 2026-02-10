"use client";

import { useEffect, useMemo, useState } from "react";
import AOS from "aos";
import Image from "next/image";
import LoginButton from "@/components/auth/LoginButton";
import LogoutButton from "@/components/auth/LogoutButton";
import { API_BASE_URL, getAccessToken } from "@/lib/api";
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
import {
  FaJava,
  FaDatabase,
  FaHashtag,
  FaGithub,
  FaLinkedin,
  FaFilePdf,
} from "react-icons/fa";
import { IconType } from "react-icons";

type TabType = "about" | "projects" | "testimonials";
type BilingualText = { en: string; fr: string };

type Skill = {
  id: string;
  name: BilingualText;
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

type Project = {
  id: string;
  title: BilingualText;
  description: BilingualText;
  imageUrl?: string | null;
  repoUrl?: string | null;
  url?: string | null;
  techStack?: string[] | null;
  featured?: boolean | null;
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

type Testimonial = {
  id: string;
  name: string;
  role?: string | null;
  company?: string | null;
  content: string;
  createdAt: string;
};

type Resume = {
  fileUrlEn: string;
  fileUrlFr: string;
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

const skillIconFileMap: Record<string, string> = {
  next: "next.svg",
  nextjs: "next.svg",
  react: "react.svg",
  reactjs: "react.svg",
  typescript: "ts.svg",
  ts: "ts.svg",
  javascript: "js.svg",
  js: "js.svg",
  html: "html.svg",
  html5: "html.svg",
  css: "css.svg",
  css3: "css.svg",
  tailwind: "tailwindcss.svg",
  tailwindcss: "tailwindcss.svg",
  node: "node.svg",
  nodejs: "node.svg",
  express: "express.svg",
  mongodb: "mongodb.svg",
  sqlite: "sqlite.svg",
  docker: "docker.svg",
  git: "git.svg",
  github: "github.svg",
  linux: "linux.svg",
  python: "python.svg",
  figma: "figma.svg",
  postman: "postman.svg",
  cloudflare: "cloudflare.svg",
  workers: "workers.svg",
  bun: "bun.svg",
  redis: "redis.svg",
  zod: "zod.svg",
  deno: "deno.svg",
  digitalocean: "digitalocean.svg",
};

function getSkillIconFile(name?: string) {
  if (!name) return null;
  const key = normalizeSkillKey(name);
  return skillIconFileMap[key] || null;
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("about");
  const [lang, setLang] = useState<"en" | "fr">("en");
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [loadingAbout, setLoadingAbout] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(false);
  const [testimonialNotice, setTestimonialNotice] = useState("");
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactStatus, setContactStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [contactNotice, setContactNotice] = useState("");
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [testimonialName, setTestimonialName] = useState("");
  const [testimonialContent, setTestimonialContent] = useState("");
  const [testimonialStatus, setTestimonialStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [resume, setResume] = useState<Resume | null>(null);
  const summary = {
    en: "Hello, I'm Annie. I like designing and building clean, user-friendly experiences, and I enjoy artistic projects that blend creativity with technology.",
    fr: "Bonjour, je m'appelle Annie. J'aime concevoir et créer des expériences claires et conviviales, et j'apprécie les projets artistiques qui allient créativité et technologie.",
  };
  const ui = {
    en: {
      admin: "Admin Dashboard",
      aboutMe: "About Me",
      projects: "Projects",
      testimonials: "Testimonials",
      loadingProfile: "Loading your profile...",
      loadingProjects: "Loading projects...",
      loadingTestimonials: "Loading testimonials...",
      noSkills: "No skills yet.",
      noExperience: "No experience yet.",
      noEducation: "No education yet.",
      noHobbies: "No hobbies yet.",
      noProjects: "No projects yet.",
      noTestimonials:
        "No approved testimonials yet. New submissions appear after approval.",
      skills: "Skills",
      experience: "Experience",
      education: "Education",
      hobbies: "Hobbies",
      getInTouch: "Get in Touch",
      contactTitle: "Get in Touch",
      contactName: "Name",
      contactEmail: "Email",
      contactMessage: "Message",
      contactCancel: "Cancel",
      contactSend: "Send",
      contactSending: "Sending...",
      contactError: "Please fill out name, email, and message.",
      testimonialAdd: "Share a testimonial",
      testimonialName: "Your name",
      testimonialComment: "Your comment",
      testimonialCancel: "Cancel",
      testimonialSubmit: "Submit",
      testimonialSubmitting: "Sending...",
      testimonialError: "Please enter your name and comment.",
      liveDemo: "Live Demo",
      sourceCode: "Source Code",
      present: "Present",
    },
    fr: {
      admin: "Tableau de bord",
      aboutMe: "À propos",
      projects: "Projets",
      testimonials: "Témoignages",
      loadingProfile: "Chargement de votre profil...",
      loadingProjects: "Chargement des projets...",
      loadingTestimonials: "Chargement des témoignages...",
      noSkills: "Aucune compétence pour le moment.",
      noExperience: "Aucune expérience pour le moment.",
      noEducation: "Aucune formation pour le moment.",
      noHobbies: "Aucun loisir pour le moment.",
      noProjects: "Aucun projet pour le moment.",
      noTestimonials:
        "Aucun témoignage approuvé pour le moment. Les nouvelles soumissions apparaissent après approbation.",
      skills: "Compétences",
      experience: "Expérience",
      education: "Formation",
      hobbies: "Loisirs",
      getInTouch: "Me contacter",
      contactTitle: "Me contacter",
      contactName: "Nom",
      contactEmail: "Courriel",
      contactMessage: "Message",
      contactCancel: "Annuler",
      contactSend: "Envoyer",
      contactSending: "Envoi...",
      contactError: "Veuillez remplir le nom, le courriel et le message.",
      testimonialAdd: "Partager un témoignage",
      testimonialName: "Votre nom",
      testimonialComment: "Votre commentaire",
      testimonialCancel: "Annuler",
      testimonialSubmit: "Soumettre",
      testimonialSubmitting: "Envoi...",
      testimonialError: "Veuillez saisir votre nom et votre commentaire.",
      liveDemo: "Démo",
      sourceCode: "Code source",
      present: "Présent",
    },
  }[lang];

  const skillsByCategory = useMemo(() => {
    const grouped: Record<string, Skill[]> = {
      Frontend: [],
      Backend: [],
      Misc: [],
      Other: [],
    };
    for (const skill of skills) {
      const catKey = (skill.category?.en || "Other") as string;
      if (grouped[catKey]) grouped[catKey].push(skill);
      else grouped.Other.push(skill);
    }
    return grouped;
  }, [skills, lang]);

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

  const loadProjects = async () => {
    setLoadingProjects(true);
    try {
      const res = await fetch(`${API_BASE_URL}/public/projects`, {
        cache: "no-store",
      });
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    loadAbout();
    loadProjects();
  }, []);

  const loadResume = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/public/resume`, {
        cache: "no-store",
      });
      if (!res.ok) return;
      const data = (await res.json()) as Resume | null;
      if (data?.fileUrlEn && data?.fileUrlFr) setResume(data);
    } catch {
      // ignore resume load errors
    }
  };

  useEffect(() => {
    loadResume();
  }, []);

  useEffect(() => {
    let alive = true;
    getAccessToken()
      .then((token) => {
        if (!alive) return;
        setIsAuthenticated(Boolean(token));
      })
      .catch(() => {
        if (!alive) return;
        setIsAuthenticated(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const loadTestimonials = async () => {
    setLoadingTestimonials(true);
    try {
      const res = await fetch(`${API_BASE_URL}/public/testimonials`, {
        cache: "no-store",
      });
      const data = await res.json();
      setTestimonials(Array.isArray(data) ? data : []);
    } finally {
      setLoadingTestimonials(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  useEffect(() => {
    AOS.refreshHard();
  }, [
    activeTab,
    skills,
    experiences,
    education,
    hobbies,
    projects,
    testimonials,
  ]);

  const submitTestimonial = async () => {
    if (!testimonialName.trim() || !testimonialContent.trim()) {
      setTestimonialStatus("error");
      return;
    }
    setTestimonialStatus("submitting");
    setTestimonialNotice("");
    try {
      await fetch(`${API_BASE_URL}/public/testimonials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: testimonialName.trim(),
          content: testimonialContent.trim(),
        }),
      });
      setTestimonialStatus("success");
      setTestimonialName("");
      setTestimonialContent("");
      setShowTestimonialForm(false);
      setTestimonialNotice(
        "Thanks! Your testimonial is submitted for approval.",
      );
      loadTestimonials();
    } catch {
      setTestimonialStatus("error");
    }
  };

  const submitContact = async () => {
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      setContactStatus("error");
      return;
    }
    setContactStatus("submitting");
    setContactNotice("");
    try {
      await fetch(`${API_BASE_URL}/public/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName.trim(),
          email: contactEmail.trim(),
          message: contactMessage.trim(),
        }),
      });
      setContactStatus("success");
      setContactName("");
      setContactEmail("");
      setContactMessage("");
      setShowContactForm(false);
      setContactNotice("Message sent! I will get back to you soon.");
    } catch {
      setContactStatus("error");
    }
  };

  return (
    <>
      <img
        src="/shapes/shape-81.svg"
        alt=""
        className="floating-shape floating-shape-a"
        aria-hidden="true"
      />
      <img
        src="/shapes/shape-77.svg"
        alt=""
        className="floating-shape floating-shape-b"
        aria-hidden="true"
      />
      <img
        src="/shapes/shape-85.svg"
        alt=""
        className="floating-shape floating-shape-c"
        aria-hidden="true"
      />
      <img
        src="/shapes/shape-79.svg"
        alt=""
        className="floating-shape floating-shape-d"
        aria-hidden="true"
      />
      <img
        src="/shapes/shape-44.svg"
        alt=""
        className="topbar-shape"
        aria-hidden="true"
      />
      <img
        src="/shapes/shape-45.svg"
        alt=""
        className="floating-shape floating-shape-top"
        aria-hidden="true"
      />
      {/* TOP HEADER */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "70px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: "2rem",
          paddingRight: "2rem",
          zIndex: 100,
          backdropFilter: "blur(10px)",
          background: "transparent",
          borderBottom: "none",
          boxShadow: "none",
        }}
      >
        {/* LEFT: Auth Controls + Language Toggle */}
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          {/* Auth Controls */}
          {isAuthenticated ? (
            <LogoutButton />
          ) : (
            <LoginButton returnTo="/admin" />
          )}

          {/* Language Toggle Switch */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(15, 23, 42, 0.08)",
              border: "2px solid #0f172a",
              borderRadius: "20px",
              padding: "4px",
              cursor: "pointer",
              gap: "0",
              boxShadow: "3px 3px 0 0 #1e293b",
            }}
            onClick={() => setLang(lang === "en" ? "fr" : "en")}
          >
            <button
              style={{
                padding: "0.5rem 1rem",
                background: lang === "en" ? "#0f172a" : "transparent",
                color: lang === "en" ? "#ffffff" : "#0f172a",
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
                background: lang === "fr" ? "#0f172a" : "transparent",
                color: lang === "fr" ? "#ffffff" : "#0f172a",
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
          {isAuthenticated && (
            <a href="/admin" className="social-btn">
              {ui.admin}
            </a>
          )}
        </div>
      </div>

      <div className="app-container" style={{ paddingTop: "120px" }}>
        <div className="portfolio-wrapper">
          {/* LEFT SIDEBAR - PROFILE */}
          <div className="profile-sidebar" data-aos="fade-right">
            <div className="profile-header">
              <div className="profile-avatar-wrap">
                <Image
                  src="/profile.jpg"
                  alt="Profile"
                  className="profile-image-small"
                  width={150}
                  height={150}
                  style={{ position: "absolute", zIndex: 10 }}
                />
              </div>

              <div className="profile-name-section">
                <div className="profile-name-row">
                  <h1 className="profile-name">Annie Yang</h1>
                  <button
                    className="get-in-touch-btn"
                    onClick={() => {
                      setContactStatus("idle");
                      setShowContactForm(true);
                    }}
                  >
                    {ui.getInTouch}
                  </button>
                </div>
                {contactNotice && (
                  <p
                    style={{
                      marginTop: "0.6rem",
                      color: "#0f172a",
                      fontWeight: 700,
                    }}
                  >
                    {contactNotice}
                  </p>
                )}
                <p className="profile-role">Full-stack Developer</p>
              </div>
            </div>

            <div className="profile-info">
              <div className="neo-card profile-bio-card animate-blur-in-500">
                <p className="bio" style={{ margin: 0 }}>
                  {summary[lang]}
                </p>
              </div>

              <div className="social-links">
                <a
                  href="https://github.com"
                  className="social-btn hint--top hint--rounded"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <FaGithub size={20} />
                </a>
                <a
                  href="https://linkedin.com"
                  className="social-btn hint--top hint--rounded"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin size={20} />
                </a>
                <a
                  href={
                    resume
                      ? lang === "fr"
                        ? resume.fileUrlFr
                        : resume.fileUrlEn
                      : lang === "fr"
                        ? "/cv-fr-v2.pdf"
                        : "/cv.pdf"
                  }
                  className="social-btn hint--top hint--rounded"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={lang === "fr" ? "CV (FR)" : "CV (EN)"}
                >
                  <FaFilePdf size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - CONTENT */}
          <div className="content-area">
            {/* NAVIGATION TABS */}
            <div className="nav-tabs" data-aos="fade-down">
              <button
                className={`nav-tab ${activeTab === "about" ? "active" : ""}`}
                onClick={() => setActiveTab("about")}
              >
                {ui.aboutMe}
              </button>
              <button
                className={`nav-tab ${activeTab === "projects" ? "active" : ""}`}
                onClick={() => setActiveTab("projects")}
              >
                {ui.projects}
              </button>
              <button
                className={`nav-tab ${activeTab === "testimonials" ? "active" : ""}`}
                onClick={() => setActiveTab("testimonials")}
              >
                {ui.testimonials}
              </button>
            </div>

            {/* CONTENT PANEL */}
            <div className="content-panel">
              {activeTab === "about" && (
                <div
                  id="about-container"
                  className="section-background"
                  data-aos="no"
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "1rem",
                    }}
                  >
                    <h2 style={{ fontSize: "1.8rem", marginBottom: 0 }}>
                      {ui.aboutMe}
                    </h2>
                  </div>
                  {loadingAbout && (
                    <p style={{ color: "#475569", lineHeight: "1.8" }}>
                      {ui.loadingProfile}
                    </p>
                  )}
                  {!loadingAbout && (
                    <div className="about-grid">
                      <section>
                        <h3 className="section-title">{ui.skills}</h3>
                        <div
                          style={{
                            display: "grid",
                            gap: "1rem",
                            gridTemplateColumns: "1fr",
                          }}
                        >
                          {(["Frontend", "Backend", "Misc"] as const).map(
                            (group) => {
                              const groupSkills = skillsByCategory[group] || [];
                              const groupLabel =
                                lang === "fr"
                                  ? group === "Frontend"
                                    ? "Front-end"
                                    : group === "Backend"
                                      ? "Back-end"
                                      : "Divers"
                                  : group;
                              return (
                                <div
                                  key={group}
                                  className="neo-card animate-blur-in-500"
                                  style={{ padding: "1.25rem" }}
                                >
                                  <h4
                                    style={{
                                      fontSize: "1.1rem",
                                      fontWeight: 800,
                                      marginBottom: "0.75rem",
                                    }}
                                  >
                                    {groupLabel}
                                  </h4>
                                  <div
                                    style={{
                                      display: "flex",
                                      gap: "0.75rem",
                                      flexWrap: "wrap",
                                    }}
                                  >
                                    {groupSkills.map((skill) => {
                                      const label = (skill.name?.[lang] ||
                                        skill.name?.en ||
                                        "Skill") as string;
                                      const file = getSkillIconFile(label);
                                      const Icon = getSkillIcon(label);
                                      return (
                                        <span
                                          className="hint--top hint--rounded"
                                          key={skill.id}
                                          aria-label={label}
                                        >
                                          <span className="skill-icon">
                                            {file ? (
                                              <Image
                                                src={`/skillicons/${file}`}
                                                alt={label}
                                                width={32}
                                                height={32}
                                              />
                                            ) : Icon ? (
                                              <Icon
                                                size={22}
                                                color={getSkillIconColor(label)}
                                              />
                                            ) : (
                                              <span className="skill-fallback">
                                                {label
                                                  .slice(0, 2)
                                                  .toUpperCase()}
                                              </span>
                                            )}
                                          </span>
                                        </span>
                                      );
                                    })}
                                    {groupSkills.length === 0 && (
                                      <span style={{ color: "#475569" }}>
                                        {ui.noSkills}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            },
                          )}
                        </div>
                      </section>

                      <section>
                        <h3 className="section-title">{ui.experience}</h3>
                        <div style={{ display: "grid", gap: "1rem" }}>
                          {experiences.map((exp) => (
                            <div
                              key={exp.id}
                              className="neo-card animate-blur-in-700"
                              style={{ padding: "1rem", display: "flex" }}
                            >
                              <div style={{ flex: 1 }}>
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
                                    color: "#475569",
                                  }}
                                >
                                  {new Date(exp.startDate).toLocaleDateString(
                                    lang === "en" ? "en-US" : "fr-FR",
                                    { month: "short", year: "numeric" },
                                  )}{" "}
                                  {exp.isCurrent
                                    ? `- ${ui.present}`
                                    : new Date(exp.endDate!).toLocaleDateString(
                                        lang === "en" ? "en-US" : "fr-FR",
                                        { month: "short", year: "numeric" },
                                      )}
                                </div>
                                <p
                                  style={{
                                    marginTop: "0.5rem",
                                    color: "#1f2937",
                                  }}
                                >
                                  {
                                    (exp.description?.[lang] ||
                                      exp.description?.en ||
                                      "") as string
                                  }
                                </p>
                              </div>
                            </div>
                          ))}
                          {experiences.length === 0 && (
                            <span style={{ color: "#475569" }}>
                              {ui.noExperience}
                            </span>
                          )}
                        </div>
                      </section>

                      <section>
                        <h3 className="section-title">{ui.education}</h3>
                        <div style={{ display: "grid", gap: "1rem" }}>
                          {education.map((edu) => (
                            <div
                              key={edu.id}
                              className="neo-card animate-blur-in-700"
                              style={{ padding: "1rem" }}
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
                                  color: "#475569",
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
                                    color: "#1f2937",
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
                            <span style={{ color: "#475569" }}>
                              {ui.noEducation}
                            </span>
                          )}
                        </div>
                      </section>

                      <section>
                        <h3 className="section-title">{ui.hobbies}</h3>
                        <div
                          style={{
                            display: "flex",
                            gap: "0.75rem",
                            flexWrap: "wrap",
                          }}
                        >
                          {hobbies.map((hobby) => (
                            <span key={hobby.id} className="neo-chip">
                              {
                                (hobby.name?.[lang] ||
                                  hobby.name?.en ||
                                  "Hobby") as string
                              }
                            </span>
                          ))}
                          {hobbies.length === 0 && (
                            <span style={{ color: "#475569" }}>
                              {ui.noHobbies}
                            </span>
                          )}
                        </div>
                      </section>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "projects" && (
                <div id="projects-container" className="section-background">
                  {loadingProjects ? (
                    <p style={{ color: "#475569" }}>{ui.loadingProjects}</p>
                  ) : projects.length === 0 ? (
                    <p style={{ color: "#475569" }}>{ui.noProjects}</p>
                  ) : (
                    <div
                      style={{
                        display: "grid",
                        gap: "1.5rem",
                        gridTemplateColumns: "1fr",
                      }}
                    >
                      {projects.map((project) => {
                        const repoHref = project.repoUrl?.trim();
                        const liveHref = project.url?.trim();
                        return (
                          <div
                            key={project.id}
                            className="neo-card animate-blur-in-700"
                            data-aos="fade-up"
                            style={{
                              overflow: "hidden",
                            }}
                          >
                            {project.imageUrl && (
                              <div
                                style={{
                                  position: "relative",
                                  width: "100%",
                                  height: "350px",
                                }}
                              >
                                <Image
                                  src={project.imageUrl}
                                  alt={`${
                                    project.title?.[lang] ||
                                    project.title?.en ||
                                    "Project"
                                  } preview`}
                                  fill
                                  style={{ objectFit: "cover" }}
                                />
                              </div>
                            )}
                            <div style={{ padding: "0.9rem 1rem 1.1rem" }}>
                              <h3
                                style={{
                                  margin: "0 0 0.4rem 0",
                                  fontSize: "1.25rem",
                                  fontWeight: 800,
                                  letterSpacing: "0.02em",
                                }}
                              >
                                {
                                  (project.title?.[lang] ||
                                    project.title?.en ||
                                    "Project") as string
                                }
                              </h3>
                              {(liveHref || repoHref) && (
                                <div
                                  style={{
                                    marginTop: "0.75rem",
                                    display: "flex",
                                    gap: "0.75rem",
                                    flexWrap: "wrap",
                                  }}
                                >
                                  {liveHref && (
                                    <a
                                      href={liveHref}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="project-btn project-btn-primary"
                                    >
                                      {ui.liveDemo}
                                    </a>
                                  )}
                                  {repoHref && (
                                    <a
                                      href={repoHref}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="project-btn project-btn-outline"
                                    >
                                      {ui.sourceCode}
                                    </a>
                                  )}
                                </div>
                              )}
                              <p
                                style={{
                                  margin: "0.9rem 0 0 0",
                                  color: "#1f2937",
                                  lineHeight: "1.6",
                                }}
                              >
                                {
                                  (project.description?.[lang] ||
                                    project.description?.en ||
                                    "") as string
                                }
                              </p>
                              {project.techStack &&
                                project.techStack.length > 0 && (
                                  <div
                                    style={{
                                      marginTop: "0.9rem",
                                      display: "flex",
                                      flexWrap: "wrap",
                                      gap: "0.5rem",
                                    }}
                                  >
                                    {(() => {
                                      const withIcon: string[] = [];
                                      const withoutIcon: string[] = [];
                                      for (const tech of project.techStack ||
                                        []) {
                                        const hasIcon =
                                          Boolean(getSkillIconFile(tech)) ||
                                          Boolean(getSkillIcon(tech));
                                        if (hasIcon) withIcon.push(tech);
                                        else withoutIcon.push(tech);
                                      }
                                      return [...withIcon, ...withoutIcon].map(
                                        (tech) => (
                                          <span
                                            key={tech}
                                            className="neo-chip"
                                            style={{
                                              fontSize: "0.8rem",
                                              display: "inline-flex",
                                              alignItems: "center",
                                              gap: "0.35rem",
                                            }}
                                          >
                                            {(() => {
                                              const file =
                                                getSkillIconFile(tech);
                                              if (file) {
                                                return (
                                                  <Image
                                                    src={`/skillicons/${file}`}
                                                    alt={tech}
                                                    width={16}
                                                    height={16}
                                                  />
                                                );
                                              }
                                              const Icon = getSkillIcon(tech);
                                              const color =
                                                getSkillIconColor(tech);
                                              return Icon ? (
                                                <Icon size={14} color={color} />
                                              ) : null;
                                            })()}
                                            {tech}
                                          </span>
                                        ),
                                      );
                                    })()}
                                  </div>
                                )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "testimonials" && (
                <div id="testimonials-container" className="section-background">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "1rem",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <h2 style={{ fontSize: "1.8rem", margin: 0 }}>
                      {ui.testimonials}
                    </h2>
                    <button
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "50%",
                        background: "#0f172a",
                        color: "#ffffff",
                        border: "2px solid #0f172a",
                        fontWeight: 700,
                        fontSize: "1.3rem",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        lineHeight: 1,
                        boxShadow: "3px 3px 0 0 #1e293b",
                      }}
                      aria-label="Add testimonial"
                      onClick={() => {
                        setTestimonialStatus("idle");
                        setShowTestimonialForm(true);
                      }}
                    >
                      +
                    </button>
                  </div>
                  {testimonialNotice && (
                    <div
                      style={{
                        padding: "0.9rem 1rem",
                        background: "rgba(255, 255, 255, 0.6)",
                        borderRadius: "16px",
                        border: "2px solid #0f172a",
                        marginBottom: "1.2rem",
                        color: "#0f172a",
                        boxShadow: "3px 3px 0 0 #1e293b",
                      }}
                    >
                      {testimonialNotice}
                    </div>
                  )}

                  {loadingTestimonials ? (
                    <p style={{ color: "#475569" }}>{ui.loadingTestimonials}</p>
                  ) : testimonials.length === 0 ? (
                    <p style={{ color: "#475569" }}>{ui.noTestimonials}</p>
                  ) : (
                    <div style={{ display: "grid", gap: "1rem" }}>
                      {testimonials.map((item) => (
                        <div
                          key={item.id}
                          className="neo-card animate-blur-in-700"
                          data-aos="fade-up"
                          style={{ padding: "1.5rem" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.75rem",
                            }}
                          >
                            <div
                              style={{
                                width: "38px",
                                height: "38px",
                                borderRadius: "50%",
                                background: "#0f172a",
                                color: "#ffffff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 700,
                                fontSize: "0.95rem",
                              }}
                              aria-label={`Avatar for ${item.name}`}
                            >
                              {(() => {
                                const parts = item.name
                                  ? item.name.trim().split(/\s+/)
                                  : [];
                                if (parts.length === 0) return "?";
                                const first = parts[0]?.[0] || "";
                                const last =
                                  parts.length > 1
                                    ? parts[parts.length - 1]?.[0] || ""
                                    : "";
                                return `${first}${last}`.toUpperCase();
                              })()}
                            </div>
                            <div>
                              <p
                                style={{
                                  margin: 0,
                                  color: "#0f172a",
                                  fontWeight: "600",
                                }}
                              >
                                {item.name}
                              </p>
                              <p
                                style={{
                                  margin: "0.35rem 0 0 0",
                                  color: "#475569",
                                  fontSize: "0.85rem",
                                }}
                              >
                                {new Date(item.createdAt).toLocaleDateString(
                                  lang === "fr" ? "fr-CA" : "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  },
                                )}
                              </p>
                            </div>
                          </div>
                          <p
                            style={{
                              margin: "0.9rem 0 0 0",
                              color: "#1f2937",
                              fontSize: "0.95rem",
                              lineHeight: "1.8",
                            }}
                          >
                            {item.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showContactForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
            zIndex: 200,
          }}
        >
          <div className="neo-card modal-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "1.3rem" }}>
                {ui.contactTitle}
              </h3>
              <button
                onClick={() => setShowContactForm(false)}
                style={{
                  background: "transparent",
                  color: "#0f172a",
                  border: "none",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                }}
                aria-label="Close"
              >
                ✁E
              </button>
            </div>

            <div className="modal-fields">
              <input
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder={ui.contactName}
                className="modal-input"
              />
              <input
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder={ui.contactEmail}
                type="email"
                className="modal-input"
              />
              <textarea
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder={ui.contactMessage}
                rows={5}
                className="modal-input modal-textarea"
              />
            </div>

            {contactStatus === "error" && (
              <p style={{ color: "#ff9b9b", marginTop: "0.8rem" }}>
                {ui.contactError}
              </p>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.75rem",
                marginTop: "1.2rem",
              }}
            >
              <button
                onClick={() => setShowContactForm(false)}
                className="project-btn project-btn-outline"
              >
                {ui.contactCancel}
              </button>
              <button
                onClick={submitContact}
                disabled={contactStatus === "submitting"}
                className="project-btn project-btn-primary"
                style={{ opacity: contactStatus === "submitting" ? 0.7 : 1 }}
              >
                {contactStatus === "submitting"
                  ? ui.contactSending
                  : ui.contactSend}
              </button>
            </div>
          </div>
        </div>
      )}

      {showTestimonialForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
            zIndex: 200,
          }}
        >
          <div className="neo-card modal-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "1.3rem" }}>
                {ui.testimonialAdd}
              </h3>
              <button
                onClick={() => setShowTestimonialForm(false)}
                style={{
                  background: "transparent",
                  color: "#0f172a",
                  border: "none",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                }}
                aria-label="Close"
              >
                ✁E
              </button>
            </div>

            <div className="modal-fields">
              <input
                value={testimonialName}
                onChange={(e) => setTestimonialName(e.target.value)}
                placeholder={ui.testimonialName}
                className="modal-input"
              />
              <textarea
                value={testimonialContent}
                onChange={(e) => setTestimonialContent(e.target.value)}
                placeholder={ui.testimonialComment}
                rows={5}
                className="modal-input modal-textarea"
              />
            </div>

            {testimonialStatus === "error" && (
              <p style={{ color: "#ff9b9b", marginTop: "0.8rem" }}>
                {ui.testimonialError}
              </p>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.75rem",
                marginTop: "1.2rem",
              }}
            >
              <button
                onClick={() => setShowTestimonialForm(false)}
                className="project-btn project-btn-outline"
              >
                {ui.testimonialCancel}
              </button>
              <button
                onClick={submitTestimonial}
                disabled={testimonialStatus === "submitting"}
                className="project-btn project-btn-primary"
                style={{
                  opacity: testimonialStatus === "submitting" ? 0.7 : 1,
                }}
              >
                {testimonialStatus === "submitting"
                  ? ui.testimonialSubmitting
                  : ui.testimonialSubmit}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
