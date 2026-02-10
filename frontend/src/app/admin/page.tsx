"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import LoginButton from "@/components/auth/LoginButton";
import LogoutButton from "@/components/auth/LogoutButton";
import { API_BASE_URL, apiFetch, getAccessToken } from "@/lib/api";

type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "date"
  | "bilingual"
  | "array"
  | "json"
  | "image";

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

type FormState = Record<string, unknown>;

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
      { name: "category", label: "Category", type: "bilingual" },
      { name: "order", label: "Order", type: "number" },
    ],
    summaryFields: ["name", "category", "order"],
  },
  {
    key: "projects",
    label: "Projects",
    path: "/admin/projects",
    fields: [
      { name: "title", label: "Title", type: "bilingual" },
      { name: "description", label: "Description", type: "bilingual" },
      { name: "repoUrl", label: "Repo URL", type: "text" },
      { name: "imageUrl", label: "Image", type: "image" },
      {
        name: "techStack",
        label: "Tech Stack (comma separated)",
        type: "array",
      },
      { name: "featured", label: "Featured", type: "boolean" },
      { name: "order", label: "Order", type: "number" },
    ],
    summaryFields: [
      "title",
      "description",
      "imageUrl",
      "techStack",
      "featured",
      "order",
    ],
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
      { name: "order", label: "Order", type: "number" },
    ],
    summaryFields: ["role", "company", "startDate", "endDate", "isCurrent"],
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
      { name: "order", label: "Order", type: "number" },
    ],
    summaryFields: ["school", "degree", "startDate", "endDate"],
  },
  {
    key: "resumes",
    label: "Resume",
    path: "/admin/resumes",
    fields: [
      { name: "fileUrlEn", label: "File URL (English)", type: "text" },
      { name: "fileUrlFr", label: "File URL (French)", type: "text" },
      { name: "isActive", label: "Active", type: "boolean" },
    ],
    summaryFields: ["fileUrlEn", "fileUrlFr", "isActive"],
  },
  {
    key: "hobbies",
    label: "Hobbies",
    path: "/admin/hobbies",
    fields: [
      { name: "name", label: "Name", type: "bilingual" },
      { name: "description", label: "Description", type: "bilingual" },
      { name: "order", label: "Order", type: "number" },
    ],
    summaryFields: ["name", "order"],
  },
  {
    key: "testimonials",
    label: "Testimonials",
    path: "/admin/testimonials",
    fields: [],
  },
  {
    key: "messages",
    label: "Messages",
    path: "/admin/messages",
    fields: [],
  },
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

function buildEmptyForm(fields: FieldDef[]): FormState {
  const data: FormState = {};
  for (const field of fields) {
    if (field.type === "bilingual") data[field.name] = { ...emptyBilingual };
    else if (field.type === "boolean") data[field.name] = false;
    else if (field.type === "array") data[field.name] = [];
    else data[field.name] = "";
  }
  return data;
}

function normalizeItemToForm(fields: FieldDef[], item: Record<string, unknown>) {
  const data: FormState = {};
  for (const field of fields) {
    const value = item?.[field.name];
    if (field.type === "bilingual") {
      data[field.name] = value || { ...emptyBilingual };
    } else if (field.type === "boolean") {
      data[field.name] = Boolean(value);
    } else if (field.type === "array") {
      data[field.name] = Array.isArray(value) ? value : [];
    } else if (field.type === "date") {
      data[field.name] = dateToInput(value as string | undefined);
    } else if (field.type === "json") {
      data[field.name] = value ? JSON.stringify(value, null, 2) : "{}";
    } else {
      data[field.name] = value ?? "";
    }
  }
  return data;
}

function buildPayload(fields: FieldDef[], form: Record<string, unknown>) {
  const data: Record<string, unknown> = {};
  for (const field of fields) {
    const value = form[field.name];
    if (field.type === "bilingual") {
      const bilingual = (value ?? emptyBilingual) as {
        en?: string;
        fr?: string;
      };
      const en = (bilingual.en ?? "").trim();
      const fr = (bilingual.fr ?? "").trim();
      data[field.name] = { en, fr };
    } else if (field.type === "number") {
      data[field.name] = value === "" ? undefined : Number(value);
    } else if (field.type === "boolean") {
      data[field.name] = Boolean(value);
    } else if (field.type === "array") {
      data[field.name] =
        typeof value === "string"
          ? value
              .split(",")
              .map((v) => v.trim())
              .filter(Boolean)
          : value;
    } else if (field.type === "date") {
      data[field.name] = value ? inputToIso(value as string) : undefined;
    } else if (field.type === "json") {
      data[field.name] = value ? JSON.parse(value as string) : undefined;
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
  const [active, setActive] = useState<ResourceDef>(
    getResourceByKey(defaultAboutKey),
  );
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(buildEmptyForm(active.fields));
  const formRef = useRef<FormState>(buildEmptyForm(active.fields));

  const setFormState = (
    next: FormState | ((prev: FormState) => FormState),
  ) => {
    setForm((prev) => {
      const resolved = typeof next === "function" ? next(prev) : next;
      formRef.current = resolved;
      return resolved;
    });
  };

  const topTabs = useMemo<TopTab[]>(
    () => [
      { key: "about", label: "About Me" },
      ...resources
        .filter((res) => !aboutKeys.includes(res.key))
        .map((res) => ({
          key: res.key,
          label: res.label,
          resourceKey: res.key,
        })),
    ],
    [],
  );

  const summaryFieldDefs = useMemo(() => {
    const names = active.summaryFields ?? active.fields.map((f) => f.name);
    return names
      .map((name) => active.fields.find((f) => f.name === name))
      .filter(Boolean) as FieldDef[];
  }, [active]);

  const renderFieldValue = (field: FieldDef, value: unknown) => {
    if (value === null || value === undefined || value === "") return "-";
    if (field.type === "bilingual") {
      const val = value as Record<string, string> | undefined;
      const en = val?.en?.trim();
      const fr = val?.fr?.trim();
      if (en && fr) return `${en} / ${fr}`;
      return en || fr || "-";
    }
    if (field.type === "boolean") return value ? "Yes" : "No";
    if (field.type === "array")
      return Array.isArray(value) ? value.join(", ") : "-";
    if (field.type === "date") {
      const d = new Date(value as string);
      return Number.isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
    }
    if (field.type === "json") return "JSON";
    if (field.type === "image") {
      return value ? (
        <Image
          src={value as string}
          alt="Preview"
          className="h-12 w-20 rounded-lg border border-white/10 object-cover"
          width={80}
          height={48}
        />
      ) : (
        "-"
      );
    }
    const text = String(value);
    return text.length > 120 ? `${text.slice(0, 120)}...` : text;
  };

  const isAuthenticated = Boolean(user);
  const isSpecialPanel =
    active.key === "testimonials" || active.key === "messages";

  useEffect(() => {
    const empty = buildEmptyForm(active.fields);
    formRef.current = empty;
    setForm(empty);
    setSelectedId(null);
  }, [active]);

  const loadItems = async () => {
    setLoadingList(true);
    setError(null);
    try {
      const data = await apiFetch(active.path, {}, true);
      setItems(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to load data";
      setError(errMsg);
      setToast({
        message: errMsg,
        type: "error",
      });
      setItems([]);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!isSpecialPanel) loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, isAuthenticated, isSpecialPanel]);

  const onEdit = (item: Record<string, unknown>) => {
    setSelectedId(item.id as string);
    const next = normalizeItemToForm(
      active.fields,
      item as Record<string, unknown>,
    );
    formRef.current = next;
    setForm(next);
  };

  const onReset = () => {
    setSelectedId(null);
    const empty = buildEmptyForm(active.fields);
    formRef.current = empty;
    setForm(empty);
  };

  const onSubmit = async () => {
    setMutating(true);
    setError(null);
    try {
      const currentForm = formRef.current;
      console.log("Admin submit form", {
        resource: active.key,
        selectedId,
        form: JSON.parse(JSON.stringify(currentForm))
      });
      const payload = buildPayload(active.fields, currentForm);
      console.log("Admin submit payload", {
        resource: active.key,
        selectedId,
        payload: JSON.parse(JSON.stringify(payload))
      });
      let saved: Record<string, unknown> | null = null;
      if (selectedId) {
        saved = await apiFetch(
          `${active.path}/${selectedId}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          },
          true,
        );
      } else {
        saved = await apiFetch(
          active.path,
          {
            method: "POST",
            body: JSON.stringify(payload),
          },
          true,
        );
      }
      if (saved) {
        setItems((prev) => {
          const idx = prev.findIndex((item) => item.id === saved?.id);
          if (idx === -1) return [saved, ...prev];
          const next = [...prev];
          next[idx] = saved;
          return next;
        });
      }
      await loadItems();
      onReset();
      setToast({ message: "Saved successfully.", type: "success" });
    } catch (err: unknown) {
      const errObj = err as Record<string, unknown> | null;
      const issues = errObj?.issues as
        | { path?: (string | number)[] }[]
        | undefined;
      if (issues && issues.length) {
        const fields = issues
          .map((i) => (i.path || []).join("."))
          .filter(Boolean);
        const uniqueFields = Array.from(new Set(fields));
        const msg =
          uniqueFields.length > 0
            ? `Missing or invalid fields: ${uniqueFields.join(", ")}`
            : "Missing or invalid fields.";
        setError(msg);
        setToast({ message: msg, type: "error" });
      } else {
        const errMsg = err instanceof Error ? err.message : "Save failed";
        setError(errMsg);
        setToast({ message: errMsg, type: "error" });
      }
    } finally {
      setMutating(false);
    }
  };

  const onDelete = async (id: string) => {
    setMutating(true);
    setError(null);
    try {
      await apiFetch(`${active.path}/${id}`, { method: "DELETE" }, true);
      await loadItems();
      if (selectedId === id) onReset();
      setToast({ message: "Deleted successfully.", type: "success" });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Delete failed";
      setError(errMsg);
      setToast({ message: errMsg, type: "error" });
    } finally {
      setMutating(false);
    }
  };

  const adminActions = useMemo(() => {
    return (
      <div className="flex gap-3">
        <button
          className="project-btn project-btn-primary"
          onClick={onSubmit}
          disabled={mutating}
        >
          {selectedId ? "Update" : "Create"}
        </button>
        <button
          className="project-btn project-btn-outline"
          onClick={onReset}
          disabled={mutating}
        >
          Clear
        </button>
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutating, selectedId]);

  if (isLoading) {
    return <div className="min-h-screen p-10 admin-page">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen p-10 admin-page flex flex-col gap-6">
        <h1 className="text-3xl font-extrabold">Admin Dashboard</h1>
        <p className="text-slate-700">Please log in to access admin features.</p>
        <div className="flex gap-3">
          <LoginButton returnTo="/admin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-10 admin-page">
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
          <Link
            href="/"
            className="project-btn project-btn-outline"
          >
            Back to Home
          </Link>
          <h1 className="text-3xl font-extrabold">Admin Dashboard</h1>
        </div>
        <LogoutButton />
      </div>

      <div className="flex gap-3 flex-wrap mb-4">
        {topTabs.map((tab) => (
          <button
            key={tab.key}
            className={`admin-tab ${
              (tab.key === "about" && activeGroup === "about") ||
              (tab.resourceKey && active.key === tab.resourceKey)
                ? "active"
                : ""
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
                className={`admin-tab text-sm ${
                  active.key === key
                    ? "active"
                    : ""
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
          <div className="admin-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{active.label} List</h2>
              <button
                className="text-sm text-slate-700 hover:text-slate-900"
                onClick={loadItems}
              >
                Refresh
              </button>
            </div>
            {error && <div className="text-red-600 mb-3">{error}</div>}
            {loadingList && <div className="text-slate-600">Loading...</div>}
            {!loadingList && items.length === 0 && (
              <div className="text-slate-600">No items yet.</div>
            )}
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {items.map((item) => {
                const typedItem = item as Record<string, unknown>;
                return (
                  <div
                    key={typedItem.id as string}
                    className="admin-item"
                  >
                    <div className="text-xs text-slate-500">
                      ID: {String(typedItem.id)}
                    </div>
                    <div className="mt-3 grid gap-2 text-sm text-slate-700">
                      {summaryFieldDefs.map((field) => (
                        <div
                          key={field.name}
                          className="flex items-start justify-between gap-4"
                        >
                          <span className="text-slate-500">{field.label}</span>
                          <span className="text-right font-medium text-slate-900">
                            {renderFieldValue(field, typedItem[field.name])}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3 mt-3">
                      <button
                        className="project-btn project-btn-primary"
                        onClick={() => onEdit(typedItem)}
                      >
                        Edit
                      </button>
                      <button
                        className="project-btn project-btn-outline"
                        onClick={() => onDelete(typedItem.id as string)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="admin-card">
            <h2 className="text-xl font-bold mb-4">
              {selectedId ? "Edit Item" : "Create Item"}
            </h2>
            <div className="space-y-4">
                  {active.fields.map((field) => (
                    <FieldInput
                      key={field.name}
                      field={field}
                      value={form[field.name]}
                      onChange={(val) =>
                        setFormState((prev) => ({ ...prev, [field.name]: val }))
                      }
                    />
                  ))}
            </div>
            <div className="mt-6 flex items-center gap-3">{adminActions}</div>
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
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (val: unknown) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (field.type === "bilingual") {
    const bilingual = (value ?? emptyBilingual) as Record<string, string>;
    return (
      <div className="grid gap-2">
        <label className="admin-label">{field.label}</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <input
            className="admin-input"
            placeholder="English"
            value={bilingual?.en || ""}
            onChange={(e) => onChange({ ...bilingual, en: e.target.value })}
          />
          <input
            className="admin-input"
            placeholder="French"
            value={bilingual?.fr || ""}
            onChange={(e) => onChange({ ...bilingual, fr: e.target.value })}
          />
        </div>
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div className="grid gap-2">
        <label className="admin-label">{field.label}</label>
        <textarea
          className="admin-input min-h-[120px]"
          value={(value ?? "") as string}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }

  if (field.type === "boolean") {
    return (
      <label className="flex items-center gap-3 text-sm font-semibold text-slate-800">
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
        <label className="admin-label">{field.label}</label>
        <input
          type="datetime-local"
          className="admin-input"
          value={(value ?? "") as string}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }

  if (field.type === "json") {
    return (
      <div className="grid gap-2">
        <label className="admin-label">{field.label}</label>
        <textarea
          className="admin-input min-h-[120px] font-mono text-xs"
          value={(value ?? "{}") as string}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }

  if (field.type === "image") {
    const onFileChange = async (file?: File | null) => {
      if (!file) return;
      setUploading(true);
      setUploadError(null);
      try {
        const token = await getAccessToken();
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch(`${API_BASE_URL}/admin/uploads`, {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          body: formData,
        });
        if (!res.ok) {
          const contentType = res.headers.get("content-type") || "";
          if (contentType.includes("application/json")) {
            const json = await res.json();
            throw new Error(
              json?.error?.message || json?.message || "Upload failed",
            );
          }
          const text = await res.text();
          throw new Error(text || "Upload failed");
        }
        const data = await res.json();
        onChange(data.url);
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : "Upload failed";
        setUploadError(errMsg);
      } finally {
        setUploading(false);
      }
    };

    return (
      <div className="grid gap-3">
        <label className="admin-label">{field.label}</label>
        <div className="flex flex-col gap-2">
          <label className="project-btn project-btn-outline cursor-pointer w-fit">
            Upload Image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onFileChange(e.target.files?.[0])}
            />
          </label>
          <input
            className="admin-input"
            placeholder="Image URL"
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
          />
          {value ? (
            <div>
              <Image
                src={value as string}
                alt="Preview"
                className="rounded-xl border border-slate-200 max-h-40 object-cover"
                width={400}
                height={160}
              />
            </div>
          ) : null}
          {uploading && (
            <div className="text-xs text-slate-600">Uploading...</div>
          )}
          {uploadError && (
            <div className="text-xs text-red-600">{uploadError}</div>
          )}
        </div>
      </div>
    );
  }

  const type = field.type === "number" ? "number" : "text";

  return (
    <div className="grid gap-2">
      <label className="admin-label">{field.label}</label>
      <input
        type={type}
        className="admin-input"
        placeholder={field.placeholder}
        value={(value ?? "") as string}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function TestimonialsPanel() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch("/admin/testimonials", {}, true);
      setItems(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error ? err.message : "Failed to load testimonials";
      setError(errMsg);
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
      await apiFetch(
        `/admin/testimonials/${id}/${action}`,
        { method: "POST" },
        true,
      );
      await load();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Action failed";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id: string) => {
    setLoading(true);
    try {
      await apiFetch(`/admin/testimonials/${id}`, { method: "DELETE" }, true);
      await load();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Delete failed";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 admin-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Testimonials</h2>
        <button
          className="text-sm text-slate-700 hover:text-slate-900"
          onClick={load}
        >
          Refresh
        </button>
      </div>
      {error && <div className="text-red-600 mb-3">{error}</div>}
      {loading && <div className="text-slate-600">Loading...</div>}
      {!loading && items.length === 0 && (
        <div className="text-slate-600">No testimonials.</div>
      )}
      <div className="space-y-3">
        {items.map((item) => {
          const typedItem = item as Record<string, unknown>;
          return (
            <div
              key={typedItem.id as string}
              className="admin-item"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{String(typedItem.name)}</div>
                  <div className="text-xs text-slate-600">
                    {String(typedItem.role || "")}{" "}
                    {String(typedItem.company || "")}
                  </div>
                </div>
                <div className="text-xs text-slate-700">
                  {String(typedItem.status)}
                </div>
              </div>
              <p className="text-sm text-slate-700 mt-2">
                {String(typedItem.content)}
              </p>
              <div className="flex gap-3 mt-3">
                <button
                  className="project-btn project-btn-primary"
                  onClick={() =>
                    updateStatus(typedItem.id as string, "approve")
                  }
                >
                  Approve
                </button>
                <button
                  className="project-btn project-btn-outline"
                  onClick={() => updateStatus(typedItem.id as string, "reject")}
                >
                  Reject
                </button>
                <button
                  className="project-btn project-btn-outline"
                  onClick={() => onDelete(typedItem.id as string)}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MessagesPanel() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch("/admin/messages", {}, true);
      setItems(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error ? err.message : "Failed to load messages";
      setError(errMsg);
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
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Delete failed";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 admin-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Contact Messages</h2>
        <button
          className="text-sm text-slate-700 hover:text-slate-900"
          onClick={load}
        >
          Refresh
        </button>
      </div>
      {error && <div className="text-red-600 mb-3">{error}</div>}
      {loading && <div className="text-slate-600">Loading...</div>}
      {!loading && items.length === 0 && (
        <div className="text-slate-600">No messages.</div>
      )}
      <div className="space-y-3">
        {items.map((item) => {
          const typedItem = item as Record<string, unknown>;
          return (
            <div
              key={typedItem.id as string}
              className="admin-item"
            >
              <div className="font-semibold">
                {String(typedItem.name)} ? {String(typedItem.email)}
              </div>
              <div className="text-xs text-slate-600">
                {(typedItem.subject as string) || ""}
              </div>
              <p className="text-sm text-slate-700 mt-2">
                {String(typedItem.message)}
              </p>
              <button
                className="project-btn project-btn-outline mt-3"
                onClick={() => onDelete(typedItem.id as string)}
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
