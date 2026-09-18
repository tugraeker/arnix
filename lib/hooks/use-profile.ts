"use client";

import * as React from "react";
import { supabase, createClient } from "../supabase/client";
import { isSupabaseReady } from "../supabase/helpers";
import type { AppRole } from "../constants";
import type { Profile } from "../types";
import { setStoredRole, useUserRole as useStoredRole } from "@/components/shared/role-gate";

type AuthState = {
  user: { id: string; email?: string } | null;
  profile: Profile | null;
  role: AppRole | null;
  loading: boolean;
  error: Error | null;
  initialized: boolean;
};

const initial: AuthState = {
  user: null,
  profile: null,
  role: null,
  loading: true,
  error: null,
  initialized: false,
};

function useProfileBase() {
  const storedRole = useStoredRole();
  const [state, setState] = React.useState<AuthState>(() => ({
    ...initial,
    role: storedRole,
  }));

  const refresh = React.useCallback(async () => {
    if (!isSupabaseReady()) {
      setState((s) => ({
        ...s,
        loading: false,
        initialized: true,
        role: storedRole ?? s.role,
      }));
      return;
    }
    try {
      setState((s) => ({ ...s, loading: true, error: null }));
      const sb = supabase ?? createClient();
      const {
        data: { user },
      } = await sb.auth.getUser();
      if (!user) {
        setState({
          user: null,
          profile: null,
          role: storedRole,
          loading: false,
          error: null,
          initialized: true,
        });
        return;
      }
      const { data: profile, error: pErr } = (await sb
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle()) as unknown as {
        data: Profile | null;
        error: Error | null;
      };
      if (pErr) throw pErr;
      const dbRole: AppRole | null = (profile?.role as AppRole) ?? storedRole;
      if (dbRole) setStoredRole(dbRole);
      setState({
        user: { id: user.id, email: user.email },
        profile,
        role: dbRole,
        loading: false,
        error: null,
        initialized: true,
      });
    } catch (err) {
      setState({
        user: null,
        profile: null,
        role: storedRole,
        loading: false,
        error: err instanceof Error ? err : new Error(String(err)),
        initialized: true,
      });
    }
  }, [storedRole]);

  React.useEffect(() => {
    refresh();
    if (!isSupabaseReady()) return;
    const sb = supabase ?? createClient();
    const {
      data: { subscription },
    } = sb.auth.onAuthStateChange(() => {
      refresh();
    });
    return () => subscription?.unsubscribe();
  }, [refresh]);

  return { ...state, refresh };
}

export function useProfile() {
  return useProfileBase();
}

export function useCurrentRole(): AppRole | null {
  const { role, initialized } = useProfileBase();
  const storedFallback = useStoredRole();
  if (!initialized) return storedFallback ?? null;
  return role ?? storedFallback ?? null;
}
