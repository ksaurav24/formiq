 
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authClient } from "@/lib/authClient";
import useSubmissionStore from "./submission.store";
import useProjectStore from "./project.store";

// --- Types --- 
 
interface AuthState {
  user: any;
  session: any;
  isAuthenticated: boolean;
  loading: boolean;
}

interface AuthActions {
  signIn: (provider?: "google" | "github", callbackUrl?: string) => Promise<any>;
  signOut: () => Promise<void>; 
  loadSession: () => Promise<void>;
  setUser: (user: any) => void;
  setSession: (session: any) => void;
  clearAuth: () => void;
}

// --- Zustand Store ---
export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isAuthenticated: false,
      loading: false,

      signIn: async (provider?: "google" | "github", callbackUrl?: string) => {
        set({ loading: true });
        try {
          const providerStr = provider ? provider : "google";
          const origin = typeof window !== "undefined" ? window.location.origin : undefined;
          const data = await authClient.signIn.social({
            provider: providerStr,
            callbackURL: origin ? `${origin}${callbackUrl}` : undefined,
            errorCallbackURL: origin ? `${origin}/auth?error=true&provider=${providerStr}` : undefined,
            newUserCallbackURL: origin ? `${origin}${callbackUrl}?newUser=1&provider=${providerStr}` : undefined,
          });

          set({
            user: (data.data as any).user ?? null,
            session: (data.data as any).session ?? null,
            isAuthenticated: !!(data.data as any).user && !!(data.data as any).session,
            loading: false,
          });
          return data;
        } catch (err) {
          console.error("Sign-in failed:", err);
          set({ user: null, session: null, isAuthenticated: false, loading: false });
          throw err;
        }
      },

      signOut: async () => {
        try {
          await authClient.signOut();
          useAuthStore.getState().clearAuth();
          useProjectStore.getState().clearProjectsCache();
          useSubmissionStore.getState().clearAllCache();
        } finally {
          set({ user: null, session: null, isAuthenticated: false });
        }
      },

      loadSession: async () => {
        try {
          const data = await authClient.getSession();
          set({
            user: data.data?.user ?? null,
            session: data.data?.session ?? null,
            isAuthenticated: !!data.data?.user && !!data.data?.session,
          });
        } catch {
          set({ user: null, session: null, isAuthenticated: false });
        }
      },

      setUser: (user) =>
        set((state) => ({ user, isAuthenticated: !!user && !!state.session })),
      setSession: (session) =>
        set((state) => ({ session, isAuthenticated: !!session && !!state.user })),
      clearAuth: () => set({ user: null, session: null, isAuthenticated: false }),
    }),
    {
      name: "authClient-session",
      onRehydrateStorage: () => (state, error) => {
        if (error) return;
        useAuthStore.getState().loadSession();
      },
    }
  )
);

// Cross-tab sync
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === "authClient-session") {
      useAuthStore.getState().loadSession();
    }
  });
}


// --- Cross-tab sync ---
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === "authClient-session") {
      useAuthStore.getState().loadSession();
    }
  });
}
