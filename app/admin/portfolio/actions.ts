"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { PROJECTS_DATA } from "@/lib/data/site-data";

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
            is_demo: project.is_demo,
            is_featured: project.is_featured,
            delivery_days: project.delivery_days,
          },
        ])
        .select()
        .single();

      if (error) {
        return { success: false, message: error.message };
      }

      revalidatePath("/admin/portfolio");
      revalidatePath("/work");
      revalidatePath("/");
      return { success: true, project: data };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create project";
      return { success: false, message };
    }
  }

  // Fallback in-memory
  localProjectsCache = [newProject, ...localProjectsCache];
  revalidatePath("/admin/portfolio");
  revalidatePath("/work");
  revalidatePath("/");
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

      if (error) {
        return { success: false, message: error.message };
      }

      revalidatePath("/admin/portfolio");
      revalidatePath("/work");
      revalidatePath("/");
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update project";
      return { success: false, message };
    }
  }

  // Fallback in-memory
  localProjectsCache = localProjectsCache.map((p) =>
    p.id === id || p.slug === project.slug
      ? { ...p, ...project, updated_at: new Date().toISOString() }
      : p
  );

  revalidatePath("/admin/portfolio");
  revalidatePath("/work");
  revalidatePath("/");
  return { success: true };
}

export async function deleteAdminProject(
  id: string
): Promise<{ success: boolean; message?: string }> {
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { error } = await supabaseAdmin.from("projects").delete().eq("id", id);
      if (error) {
        return { success: false, message: error.message };
      }

      revalidatePath("/admin/portfolio");
      revalidatePath("/work");
      revalidatePath("/");
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete project";
      return { success: false, message };
    }
  }

  localProjectsCache = localProjectsCache.filter((p) => p.id !== id);
  revalidatePath("/admin/portfolio");
  revalidatePath("/work");
  revalidatePath("/");
  return { success: true };
}
