// src/store/project.store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiClient from "@/lib/apiClient";

export type Project = {
  projectId: string;
  _id: string | number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  authorizedDomains?: string[];
  keys: { publicKey: string; secretKey?: string };
  emailNotifications: boolean;
  owner: string;
  lastSubmission?: string;
  submissionCount?: number;
  _v?: number;
};

type ProjectStoreState = {
  projects: Partial<Project>[];
  loading: boolean;
  error: string | null;
  hasFetched: boolean;
  updateProject: (
    id: Project["projectId"],
    data: Partial<Project>
  ) => Promise<Project>;
  fetchProjects: () => Promise<void>;
  getProjectById: (id: string) => Promise<Project | undefined>;
  initializeProjects: () => Promise<void>;
  newProject: (data: Partial<Project>) => Promise<Project>;
  deleteProject: (id: Project["projectId"]) => Promise<true>;
  clearProjectsCache: () => void;
};

const useProjectStore = create<ProjectStoreState>()(
  persist(
    (set, get) => ({
      projects: [],
      loading: false,
      error: null,
      hasFetched: false,

      fetchProjects: async () => {
        set({ loading: true });
        try {
          const { data: response } = await apiClient.get("/projects");
          set({
            projects: response.data.projects as Partial<Project>[],
            hasFetched: true,
            error: null,
          });
        } catch (error: any) {
          const message =
            error?.response?.data?.message ||
            error?.message ||
            String(error);
          set({ error: message, hasFetched: true });
          throw new Error(message);
        } finally {
          set({ loading: false });
        }
      },

      initializeProjects: async () => {
        const { hasFetched, fetchProjects } = get();
        if (!hasFetched) await fetchProjects();
      },

      updateProject: async (id, data) => {
        set({ loading: true });
        try {
          const res = await apiClient.put(`/projects/${id}`, data);
          if (res.status < 200 || res.status >= 300)
            throw new Error("Failed to update project");
          const updated: Project = (res.data?.data ?? res.data) as Project;
          set({
            projects: get().projects.map((p) =>
              p.projectId === id ? { ...p, ...updated } : p
            ),
            error: null,
          });
          return get().projects.find((p) => p.projectId === id) as Project;
        } catch (error: any) {
          const message =
            error?.response?.data?.message ||
            error?.message ||
            String(error);
          set({ error: message });
          throw new Error(message);
        } finally {
          set({ loading: false });
        }
      },

      newProject: async (projectData) => {
        set({ loading: true });
        try {
          const { data: response, status } = await apiClient.post(
            "/projects",
            projectData
          );
          if (status < 200 || status >= 300)
            throw new Error("Failed to create project");
          set({
            projects: [...get().projects, response.data],
            error: null,
          });
          return response.data as Project;
        } catch (error: any) {
          const message =
            error?.response?.data?.message ||
            error?.message ||
            String(error);
          set({ error: message });
          throw new Error(message);
        } finally {
          set({ loading: false });
        }
      },

      getProjectById: async (id) => {
        try {
          const { data: response } = await apiClient.get(`/projects/${id}`);
          return response.data as Project;
        } catch (error: any) {
          const message =
            error?.response?.data?.message ||
            error?.message ||
            String(error);
          set({ error: message });
          throw new Error(message);
        }
      },

      deleteProject: async (id) => {
        set({ loading: true });
        try {
          const res = await apiClient.delete(`/projects/${id}`);
          if (res.status < 200 || res.status >= 300)
            throw new Error("Failed to delete project");
          set({
            projects: get().projects.filter((p) => p.projectId !== id),
            error: null,
          });
          return true;
        } catch (error: any) {
          const message =
            error?.response?.data?.message ||
            error?.message ||
            String(error);
          set({ error: message });
          throw new Error(message);
        } finally {
          set({ loading: false });
        }
      },

      clearProjectsCache: () => {
        set({ projects: [], hasFetched: false });
      },
    }),
    {
      name: "projects-store",
      partialize: (state) => ({
        // only persist serializable fields
        projects: state.projects,
        hasFetched: state.hasFetched,
      }),
    }
  )
);

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === "projects-store") {
      const newState = JSON.parse(event.newValue || "{}");
      useProjectStore.setState((state: any) => ({ ...state, ...newState }));
    }
  });
}

export default useProjectStore;
