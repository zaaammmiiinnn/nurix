"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { PROJECTS_DATA } from "@/lib/data/site-data";

function safeRevalidate(path: string) {
  try {
    revalidatePath(path);
  } catch {
    // Graceful fallback when invoked outside Next.js request context (tests/scripts)
  }
}

export interface AdminProject {
  id?: string;
  slug: string;
  title: string;
  client: string;
  sector: string;
  tag: string;
  result_metric: string;
  overview: string;
  problem: string;
  solution: string;
  tech_stack: string[];
  image_url?: string;
  is_demo: boolean;
  is_featured: boolean;
  delivery_days: string;
  created_at?: string;
  updated_at?: string;
}

// In-memory fallback cache when Supabase is not configured
let localProjectsCache: AdminProject[] = PROJECTS_DATA.map((p, idx) => ({
  id: `mock-proj-${idx + 1}`,
  slug: p.slug,
  title: p.title,
  client: p.client,
  sector: p.sector,
  tag: p.tag,
  result_metric: p.resultMetric,
  overview: p.overview,
  problem: p.problem,
  solution: p.solution,
  tech_stack: p.techStack,
  is_demo: p.isDemo,
  is_featured: p.isFeatured,
  delivery_days: p.deliveryDays,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));

export async function getAdminProjects(): Promise<AdminProject[]> {
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((item) => ({
          id: item.id,
          slug: item.slug,
          title: item.title,
          client: item.client || "",
          sector: item.sector || "",
          tag: item.tag || "",
          result_metric: item.result_metric || "",
          overview: item.overview || "",
          problem: item.problem || "",
          solution: item.solution || "",
          tech_stack: Array.isArray(item.tech_stack) ? item.tech_stack : [],
          image_url: item.image_url || "",
          is_demo: Boolean(item.is_demo),
          is_featured: Boolean(item.is_featured),
          delivery_days: item.delivery_days || "",
          created_at: item.created_at,
          updated_at: item.updated_at,
        }));
      }
    } catch (err) {
      console.warn("Failed fetching projects from Supabase:", err);
    }
  }

  return localProjectsCache;
}

export async function createAdminProject(
  project: Omit<AdminProject, "id" | "created_at" | "updated_at">
): Promise<{ success: boolean; project?: AdminProject; message?: string }> {
  const newProject: AdminProject = {
    ...project,
    id: `proj-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from("projects")
        .insert([
          {
            slug: project.slug,
            title: project.title,
            client: project.client,
            sector: project.sector,
            tag: project.tag,
            result_metric: project.result_metric,
            overview: project.overview,
            problem: project.problem,
            solution: project.solution,
            tech_stack: project.tech_stack,
            image_url: project.image_url,
            is_demo: project.is_demo,
            is_featured: project.is_featured,
            is_published: true,
            delivery_days: project.delivery_days,
          },
        ])
        .select()
        .single();

      if (!error && data) {
        safeRevalidate("/admin/portfolio");
        safeRevalidate("/work");
        safeRevalidate("/");
        return { success: true, project: data };
      }
      console.warn("Supabase insert error (falling back to cache):", error?.message);
    } catch (err: unknown) {
      console.warn("Supabase network error (falling back to cache):", err);
    }
  }

  // Fallback in-memory
  localProjectsCache = [newProject, ...localProjectsCache];
  safeRevalidate("/admin/portfolio");
  safeRevalidate("/work");
  safeRevalidate("/");
  return { success: true, project: newProject };
}

export async function updateAdminProject(
  id: string,
  project: Partial<AdminProject>
): Promise<{ success: boolean; message?: string }> {
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { error } = await supabaseAdmin
        .from("projects")
        .update({
          ...project,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (!error) {
        safeRevalidate("/admin/portfolio");
        safeRevalidate("/work");
        safeRevalidate("/");
        return { success: true };
      }
      console.warn("Supabase update error (falling back to cache):", error?.message);
    } catch (err: unknown) {
      console.warn("Supabase network error (falling back to cache):", err);
    }
  }

  // Fallback in-memory
  localProjectsCache = localProjectsCache.map((p) =>
    p.id === id || p.slug === project.slug
      ? { ...p, ...project, updated_at: new Date().toISOString() }
      : p
  );

  safeRevalidate("/admin/portfolio");
  safeRevalidate("/work");
  safeRevalidate("/");
  return { success: true };
}

export async function deleteAdminProject(
  id: string
): Promise<{ success: boolean; message?: string }> {
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { error } = await supabaseAdmin.from("projects").delete().eq("id", id);
      if (!error) {
        safeRevalidate("/admin/portfolio");
        safeRevalidate("/work");
        safeRevalidate("/");
        return { success: true };
      }
      console.warn("Supabase delete error (falling back to cache):", error?.message);
    } catch (err: unknown) {
      console.warn("Supabase network error (falling back to cache):", err);
    }
  }

  localProjectsCache = localProjectsCache.filter((p) => p.id !== id);
  safeRevalidate("/admin/portfolio");
  safeRevalidate("/work");
  safeRevalidate("/");
  return { success: true };
}

/**
 * Uploads a project screenshot or mock image to Supabase Storage bucket 'projects'.
 */
export async function uploadProjectImage(
  formData: FormData
): Promise<{ success: boolean; url?: string; message?: string }> {
  try {
    const file = formData.get("file") as File | null;
    if (!file) {
      return { success: false, message: "No file provided" };
    }

    // Check size limit: 5MB
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, message: "File exceeds 5MB size limit" };
    }

    // Check mime type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      return { success: false, message: "Invalid image format. Supported: PNG, JPG, WebP, SVG" };
    }

    const fileExt = file.name.split(".").pop() || "png";
    const fileName = `project-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        const { error: uploadError } = await supabaseAdmin.storage
          .from("projects")
          .upload(fileName, fileBuffer, {
            contentType: file.type,
            upsert: true,
          });

        if (uploadError) {
          console.warn("Storage upload error (fallback to local data URL):", uploadError);
        } else {
          const { data: publicUrlData } = supabaseAdmin.storage
            .from("projects")
            .getPublicUrl(fileName);

          return { success: true, url: publicUrlData.publicUrl };
        }
      } catch (storageErr) {
        console.warn("Storage exception:", storageErr);
      }
    }

    // Fallback: Generate Base64 Data URL for local preview
    const base64 = fileBuffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;
    return { success: true, url: dataUrl };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to upload image";
    return { success: false, message };
  }
}
