"use client";

import { useEffect, useMemo, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import LoginButton from "@/components/auth/LoginButton";
import LogoutButton from "@/components/auth/LogoutButton";
import { apiFetch } from "@/lib/api";

type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "date"
  | "bilingual"
  | "array"
  | "json";

type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
};

type ResourceDef = {
  key: string;
  label: string;
  path: string;
  fields: FieldDef[];
  summaryFields?: string[];
};

type TopTab = {
  key: string;
  label: string;
  resourceKey?: string;
};

const resources: ResourceDef[] = [
  {
    key: "skills",
    label: "Skills",
    path: "/admin/skills",
    fields: [
      { name: "name", label: "Name", type: "bilingual" },
      { name: "level", label: "Level (1-10)", type: "number" },
      { name: "category", label: "Category", type: "bilingual" },
      { name: "order", label: "Order", type: "number" }
    ],
    summaryFields: ["name", "category", "level", "order"]
  },
  {
    key: "projects",
    label: "Projects",
    path: "/admin/projects",
    fields: [
      { name: "title", label: "Title", type: "bilingual" },
      { name: "description", label: "Description", type: "bilingual" },
      { name: "url", label: "Live URL", type: "text" },
      { name: "repoUrl", label: "Repo URL", type: "text" },
      { name: "imageUrl", label: "Image URL", type: "text" },
      { name: "techStack", label: "Tech Stack (comma separated)", type: "array" },
      { name: "featured", label: "Featured", type: "boolean" },
      { name: "order", label: "Order", type: "number" }
    ],
    summaryFields: ["title", "url", "featured", "order"]
  },
  {
    key: "experiences",
    label: "Work Experience",
    path: "/admin/experiences",
    fields: [
      { name: "company", label: "Company", type: "bilingual" },
      { name: "role", label: "Role", type: "bilingual" },
      { name: "description", label: "Description", type: "bilingual" },
      { name: "startDate", label: "Start Date", type: "date" },
      { name: "endDate", label: "End Date", type: "date" },
      { name: "isCurrent", label: "Current Role", type: "boolean" },
      { name: "location", label: "Location", type: "bilingual" },
      { name: "order", label: "Order", type: "number" }
    ],
    summaryFields: ["role", "company", "startDate", "endDate", "isCurrent"]
  },
  {
    key: "education",
    label: "Education",
    path: "/admin/education",
    fields: [
      { name: "school", label: "School", type: "bilingual" },
      { name: "degree", label: "Degree", type: "bilingual" },
      { name: "field", label: "Field", type: "bilingual" },
      { name: "description", label: "Description", type: "bilingual" },
      { name: "startDate", label: "Start Date", type: "date" },
      { name: "endDate", label: "End Date", type: "date" },
      { name: "order", label: "Order", type: "number" }
    ],
    summaryFields: ["school", "degree", "startDate", "endDate"]
  },
  {
    key: "resumes",
    label: "Resume",
    path: "/admin/resumes",
    fields: [
      { name: "title", label: "Title", type: "bilingual" },
      { name: "fileUrl", label: "File URL", type: "text" },
      { name: "isActive", label: "Active", type: "boolean" }
    ],
    summaryFields: ["title", "isActive", "fileUrl"]
  },
  {
    key: "contact-info",
    label: "Contact Info",
    path: "/admin/contact-info",
    fields: [
      { name: "email", label: "Email", type: "text" },
      { name: "phone", label: "Phone", type: "text" },
      { name: "location", label: "Location", type: "bilingual" },
      { name: "website", label: "Website", type: "text" },
      { name: "socials", label: "Socials (JSON)", type: "json" }
    ],
    summaryFields: ["email", "phone", "location", "website"]
  },
  {
    key: "hobbies",
    label: "Hobbies",
    path: "/admin/hobbies",
    fields: [
      { name: "name", label: "Name", type: "bilingual" },
      { name: "description", label: "Description", type: "bilingual" },
      { name: "order", label: "Order", type: "number" }
    ],
    summaryFields: ["name", "order"]
  },
  {
    key: "testimonials",
    label: "Testimonials",
    path: "/admin/testimonials",
    fields: []
  },
  {
    key: "messages",
    label: "Messages",
    path: "/admin/messages",
    fields: []
  }
];

const aboutKeys = ["skills", "experiences", "education", "hobbies"];
const defaultAboutKey = "skills";

const dateToInput = (value?: string) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 16);
};

const inputToIso = (value?: string) => {
  if (!value) return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString();
};

const emptyBilingual = { en: "", fr: "" };

function buildEmptyForm(fields: FieldDef[]) {
  const data: Record<string, any> = {};
  for (const field of fields) {
    if (field.type === "bilingual") data[field.name] = { ...emptyBilingual };
    else if (field.type === "boolean") data[field.name] = false;
    else if (field.type === "array") data[field.name] = [];
    else data[field.name] = "";
  }
  return data;
}

function normalizeItemToForm(fields: FieldDef[], item: Record<string, any>) {
  const data: Record<string, any> = {};
  for (const field of fields) {
    const value = item?.[field.name];
    if (field.type === "bilingual") {
      data[field.name] = value || { ...emptyBilingual };
    } else if (field.type === "boolean") {
      data[field.name] = Boolean(value);
    } else if (field.type === "array") {
      data[field.name] = Array.isArray(value) ? value : [];
    } else if (field.type === "date") {
      data[field.name] = dateToInput(value);
    } else if (field.type === "json") {
      data[field.name] = value ? JSON.stringify(value, null, 2) : "{}";
    } else {
      data[field.name] = value ?? "";
    }
  }
  return data;
}

function buildPayload(fields: FieldDef[], form: Record<string, any>) {
  const data: Record<string, any> = {};
  for (const field of fields) {
    const value = form[field.name];
    if (field.type === "bilingual") {
      data[field.name] = value;
    } else if (field.type === "number") {
      data[field.name] = value === "" ? undefined : Number(value);
    } else if (field.type === "boolean") {
      data[field.name] = Boolean(value);
    } else if (field.type === "array") {
      data[field.name] = typeof value === "string"
        ? value
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean)
        : value;
    } else if (field.type === "date") {
      data[field.name] = value ? inputToIso(value) : undefined;
    } else if (field.type === "json") {
      data[field.name] = value ? JSON.parse(value) : undefined;
    } else {
      data[field.name] = value === "" ? undefined : value;
    }
  }
  return data;
}

export default function AdminPage() {
  const { user, isLoading } = useUser();
  const getResourceByKey = (key: string) =>
    resources.find((res) => res.key === key) || resources[0];
  const [activeGroup, setActiveGroup] = useState<"about" | "general">("about");
  const [active, setActive] = useState<ResourceDef>(getResourceByKey(defaultAboutKey));
  const [items, setItems] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, any>>(buildEmptyForm(active.fields));

  const topTabs = useMemo<TopTab[]>(
    () => [
      { key: "about", label: "About Me" },
      ...resources
        .filter((res) => !aboutKeys.includes(res.key))
        .map((res) => ({ key: res.key, label: res.label, resourceKey: res.key }))
    ],
    []
  );

  const summaryFieldDefs = useMemo(() => {
    const names = active.summaryFields ?? active.fields.map((f) => f.name);
    return names
      .map((name) => active.fields.find((f) => f.name === name))
      .filter(Boolean) as FieldDef[];
  }, [active]);

  const renderFieldValue = (field: FieldDef, value: any) => {
    if (value === null || value === undefined || value === "") return "—";
    if (field.type === "bilingual") {
      return value?.en || value?.fr || "—";
    }
    if (field.type === "boolean") return value ? "Yes" : "No";
    if (field.type === "array") return Array.isArray(value) ? value.join(", ") : "—";
    if (field.type === "date") {
      const d = new Date(value);
      return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
    }
    if (field.type === "json") return "[JSON]";
    const text = String(value);
    return text.length > 120 ? `${text.slice(0, 120)}…` : text;
  };

  const isAuthenticated = Boolean(user);
  const isSpecialPanel = active.key === "testimonials" || active.key === "messages";

  useEffect(() => {
    setForm(buildEmptyForm(active.fields));
    setSelectedId(null);
  }, [active]);

  const loadItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(active.path, {}, true);
      setItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || "Failed to load data");
      setToast({ message: err?.message || "Failed to load data", type: "error" });
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!isSpecialPanel) loadItems();
  }, [active, isAuthenticated, isSpecialPanel]);

  const onEdit = (item: Record<string, any>) => {
    setSelectedId(item.id);
    setForm(normalizeItemToForm(active.fields, item));
  };

  const onReset = () => {
    setSelectedId(null);
    setForm(buildEmptyForm(active.fields));
  };

  const onSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = buildPayload(active.fields, form);
      if (selectedId) {
        await apiFetch(`${active.path}/${selectedId}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        }, true);
      } else {
        await apiFetch(active.path, {
          method: "POST",
          body: JSON.stringify(payload)
        }, true);
      }
      await loadItems();
      onReset();
      setToast({ message: "Saved successfully.", type: "success" });
    } catch (err: any) {
      const issues = err?.issues as { path?: (string | number)[] }[] | undefined;
      if (issues && issues.length) {
        const fields = issues
          .map((i) => (i.path || []).join("."))
          .filter(Boolean);
        const uniqueFields = Array.from(new Set(fields));
        setError("Please fill all required fields.");
        setToast({
          message: `Please fill all required fields: ${uniqueFields.join(", ")}`,
          type: "error"
        });
      } else {
        setError(err?.message || "Save failed");
        setToast({ message: err?.message || "Save failed", type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await apiFetch(`${active.path}/${id}`, { method: "DELETE" }, true);
      await loadItems();
      if (selectedId === id) onReset();
      setToast({ message: "Deleted successfully.", type: "success" });
    } catch (err: any) {
      setError(err?.message || "Delete failed");
      setToast({ message: err?.message || "Delete failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const adminActions = useMemo(() => {
    return (
      <div className="flex gap-3">
        <button
          className="px-4 py-2 rounded-full bg-white text-black font-bold hover:-translate-y-0.5 transition"
          onClick={onSubmit}
          disabled={loading}
        >
          {selectedId ? "Update" : "Create"}
        </button>
        <button
          className="px-4 py-2 rounded-full border border-white/40 text-white hover:border-white transition"
          onClick={onReset}
          disabled={loading}
        >
          Clear
        </button>
      </div>
    );
  }, [loading, selectedId]);

  if (isLoading) {
    return <div className="min-h-screen p-10 text-white">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen p-10 text-white flex flex-col gap-6">
        <h1 className="text-3xl font-extrabold">Admin Dashboard</h1>
        <p className="text-white/80">Please log in to access admin features.</p>
        <div className="flex gap-3">
          <LoginButton returnTo="/admin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-10 text-white">
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 rounded-2xl px-4 py-3 border backdrop-blur ${
            toast.type === "success"
              ? "border-emerald-400/60 bg-emerald-500/20 text-emerald-100"
              : "border-red-400/60 bg-red-500/20 text-red-100"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold">{toast.message}</span>
            <button
              className="text-xs opacity-80 hover:opacity-100"
              onClick={() => setToast(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <a
            href="/"
            className="px-4 py-2 rounded-full border border-white/40 text-white hover:border-white transition"
          >
            Back to Home
          </a>
          <h1 className="text-3xl font-extrabold">Admin Dashboard</h1>
        </div>
        <LogoutButton />
      </div>

      <div className="flex gap-3 flex-wrap mb-4">
        {topTabs.map((tab) => (
          <button
            key={tab.key}
            className={`px-4 py-2 rounded-full font-bold transition border ${
              (tab.key === "about" && activeGroup === "about") ||
              (tab.resourceKey && active.key === tab.resourceKey)
                ? "bg-white text-black border-white"
                : "bg-white/10 text-white border-white/20 hover:border-white/70"
            }`}
            onClick={() => {
              if (tab.key === "about") {
                setActiveGroup("about");
                setActive(getResourceByKey(defaultAboutKey));
                return;
              }
              setActiveGroup("general");
              if (tab.resourceKey) setActive(getResourceByKey(tab.resourceKey));
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeGroup === "about" && (
        <div className="flex gap-3 flex-wrap mb-8">
          {aboutKeys.map((key) => {
            const res = getResourceByKey(key);
            return (
              <button
                key={key}
                className={`px-3 py-2 rounded-full text-sm font-semibold transition border ${
                  active.key === key
                    ? "bg-white text-black border-white"
                    : "bg-white/10 text-white border-white/20 hover:border-white/70"
                }`}
                onClick={() => setActive(res)}
              >
                {res.label}
              </button>
            );
          })}
        </div>
      )}

      {!isSpecialPanel && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{active.label} List</h2>
              <button
                className="text-sm text-white/70 hover:text-white"
                onClick={loadItems}
              >
                Refresh
              </button>
            </div>
          {error && <div className="text-red-300 mb-3">{error}</div>}
            {loading && <div className="text-white/70">Loading...</div>}
            {!loading && items.length === 0 && (
              <div className="text-white/60">No items yet.</div>
            )}
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-black/40 p-4"
                >
                  <div className="text-xs text-white/50">ID: {item.id}</div>
                  <div className="mt-3 grid gap-2 text-sm text-white/85">
                    {summaryFieldDefs.map((field) => (
                      <div
                        key={field.name}
                        className="flex items-start justify-between gap-4"
                      >
                        <span className="text-white/50">{field.label}</span>
                        <span className="text-right font-medium text-white/90">
                          {renderFieldValue(field, item[field.name])}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-3">
                    <button
                      className="px-3 py-1 rounded-full bg-white text-black text-sm font-semibold"
                      onClick={() => onEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 rounded-full border border-red-400 text-red-300 text-sm"
                      onClick={() => onDelete(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-bold mb-4">
              {selectedId ? "Edit Item" : "Create Item"}
            </h2>
            <div className="space-y-4">
              {active.fields.map((field) => (
                <FieldInput
                  key={field.name}
                  field={field}
                  value={form[field.name]}
                  onChange={(val) => setForm((prev) => ({ ...prev, [field.name]: val }))}
                />
              ))}
            </div>
            <div className="mt-6 flex items-center gap-3">
              {adminActions}
            </div>
          </div>
        </div>
      )}

      {active.key === "testimonials" && <TestimonialsPanel />}
      {active.key === "messages" && <MessagesPanel />}
    </div>
  );
}

function FieldInput({
  field,
  value,
  onChange
}: {
  field: FieldDef;
  value: any;
  onChange: (val: any) => void;
}) {
  if (field.type === "bilingual") {
    return (
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-white/80">{field.label}</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <input
            className="rounded-xl bg-black/40 border border-white/20 px-3 py-2"
            placeholder="English"
            value={value?.en || ""}
            onChange={(e) => onChange({ ...value, en: e.target.value })}
          />
          <input
            className="rounded-xl bg-black/40 border border-white/20 px-3 py-2"
            placeholder="French"
            value={value?.fr || ""}
            onChange={(e) => onChange({ ...value, fr: e.target.value })}
          />
        </div>
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-white/80">{field.label}</label>
        <textarea
          className="rounded-xl bg-black/40 border border-white/20 px-3 py-2 min-h-[120px]"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }

  if (field.type === "boolean") {
    return (
      <label className="flex items-center gap-3 text-sm font-semibold text-white/80">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
        />
        {field.label}
      </label>
    );
  }

  if (field.type === "date") {
    return (
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-white/80">{field.label}</label>
        <input
          type="datetime-local"
          className="rounded-xl bg-black/40 border border-white/20 px-3 py-2"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }

  if (field.type === "json") {
    return (
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-white/80">{field.label}</label>
        <textarea
          className="rounded-xl bg-black/40 border border-white/20 px-3 py-2 min-h-[120px] font-mono text-xs"
          value={value || "{}"}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }

  const type = field.type === "number" ? "number" : "text";

  return (
    <div className="grid gap-2">
      <label className="text-sm font-semibold text-white/80">{field.label}</label>
      <input
        type={type}
        className="rounded-xl bg-black/40 border border-white/20 px-3 py-2"
        placeholder={field.placeholder}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function TestimonialsPanel() {
  const [items, setItems] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch("/admin/testimonials", {}, true);
      setItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || "Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, action: "approve" | "reject") => {
    setLoading(true);
    try {
      await apiFetch(`/admin/testimonials/${id}/${action}`, { method: "POST" }, true);
      await load();
    } catch (err: any) {
      setError(err?.message || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id: string) => {
    setLoading(true);
    try {
      await apiFetch(`/admin/testimonials/${id}`, { method: "DELETE" }, true);
      await load();
    } catch (err: any) {
      setError(err?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Testimonials</h2>
        <button className="text-sm text-white/70 hover:text-white" onClick={load}>
          Refresh
        </button>
      </div>
      {error && <div className="text-red-300 mb-3">{error}</div>}
      {loading && <div className="text-white/70">Loading...</div>}
      {!loading && items.length === 0 && <div className="text-white/60">No testimonials.</div>}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{item.name}</div>
                <div className="text-xs text-white/60">{item.role || ""} {item.company || ""}</div>
              </div>
              <div className="text-xs text-white/70">{item.status}</div>
            </div>
            <p className="text-sm text-white/80 mt-2">{item.content}</p>
            <div className="flex gap-3 mt-3">
              <button
                className="px-3 py-1 rounded-full bg-white text-black text-sm font-semibold"
                onClick={() => updateStatus(item.id, "approve")}
              >
                Approve
              </button>
              <button
                className="px-3 py-1 rounded-full border border-white/40 text-white text-sm"
                onClick={() => updateStatus(item.id, "reject")}
              >
                Reject
              </button>
              <button
                className="px-3 py-1 rounded-full border border-red-400 text-red-300 text-sm"
                onClick={() => onDelete(item.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MessagesPanel() {
  const [items, setItems] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch("/admin/messages", {}, true);
      setItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (id: string) => {
    setLoading(true);
    try {
      await apiFetch(`/admin/messages/${id}`, { method: "DELETE" }, true);
      await load();
    } catch (err: any) {
      setError(err?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Contact Messages</h2>
        <button className="text-sm text-white/70 hover:text-white" onClick={load}>
          Refresh
        </button>
      </div>
      {error && <div className="text-red-300 mb-3">{error}</div>}
      {loading && <div className="text-white/70">Loading...</div>}
      {!loading && items.length === 0 && <div className="text-white/60">No messages.</div>}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <div className="font-semibold">{item.name} ? {item.email}</div>
            <div className="text-xs text-white/60">{item.subject || "(No subject)"}</div>
            <p className="text-sm text-white/80 mt-2">{item.message}</p>
            <button
              className="mt-3 px-3 py-1 rounded-full border border-red-400 text-red-300 text-sm"
              onClick={() => onDelete(item.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
