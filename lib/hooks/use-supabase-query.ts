"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  selectAll,
  selectOne,
  insertRow,
  updateRow,
  deleteRow,
  isSupabaseReady,
  type CRUDResult,
} from "../supabase/helpers";

export type QueryFilter = {
  field: string;
  op: "eq" | "neq" | "ilike" | "gte" | "lte" | "in" | "contains";
  value: unknown;
};

export type QueryOptions<T> = {
  select?: string;
  filters?: QueryFilter[];
  order?: { field: string; ascending?: boolean };
  limit?: number;
  offset?: number;
  refetchInterval?: number;
  enabled?: boolean;
  fallback?: T[];
  onError?: (err: Error) => void;
  onSuccess?: (data: T[]) => void;
};

export function useSupabaseQuery<T = unknown>(table: string, options: QueryOptions<T> = {}) {
  const fallbackRef = useRef(options.fallback);
  const enabled = options.enabled ?? true;

  const [data, setData] = useState<T[]>(() => (fallbackRef.current ?? []) as T[]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [count, setCount] = useState<number | null>(fallbackRef.current?.length ?? null);
  const [refetchTick, setRefetchTick] = useState(0);

  const filters = options.filters;
  const order = options.order;
  const limit = options.limit;
  const offset = options.offset;
  const select = options.select;

  const refetch = useCallback(() => {
    setRefetchTick((n) => n + 1);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await selectAll<T>(table, {
          select,
          filters,
          order,
          limit,
          offset,
          fallback: fallbackRef.current,
        });
        if (cancelled) return;
        setData(res.data);
        setCount(res.count);
        setError(res.error);
        if (res.error) options.onError?.(res.error);
        else options.onSuccess?.(res.data);
      } catch (err) {
        if (cancelled) return;
        const e = err instanceof Error ? err : new Error(String(err));
        setError(e);
        options.onError?.(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [table, select, JSON.stringify(filters), JSON.stringify(order), limit, offset, enabled, refetchTick]);

  useEffect(() => {
    if (!enabled || !options.refetchInterval || !isSupabaseReady()) return;
    const id = setInterval(() => refetch(), options.refetchInterval);
    return () => clearInterval(id);
  }, [enabled, options.refetchInterval, refetch]);

  return { data, loading, error, count, refetch, setData };
}

export type SingleQueryOptions<T> = {
  select?: string;
  idField?: string;
  enabled?: boolean;
  fallback?: T | null;
};

export function useSupabaseQueryOne<T = unknown>(
  table: string,
  id: string | undefined,
  options: SingleQueryOptions<T> = {}
) {
  const enabled = options.enabled ?? true;
  const idOk = enabled && !!id;

  const [data, setData] = useState<T | null>(() => (options.fallback ?? null));
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetchTick, setRefetchTick] = useState(0);

  const refetch = useCallback(() => setRefetchTick((n) => n + 1), []);

  useEffect(() => {
    if (!idOk) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await selectOne<T>(table, id!, {
          select: options.select,
          idField: options.idField,
          fallback: options.fallback ?? null,
        });
        if (cancelled) return;
        setData(res.data);
        setError(res.error);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [table, id, idOk, options.select, options.idField, refetchTick]);

  return { data, loading, error, refetch, setData };
}

export type MutationOptions<T> = {
  idField?: string;
  select?: string;
  onSuccess?: (data: T | null, ctx: { action: "insert" | "update" | "delete" }) => void;
  onError?: (err: Error) => void;
};

export function useSupabaseMutations<T extends { id?: string | number } = any>(
  table: string,
  queryRefetch?: () => void,
  options: MutationOptions<T> = {}
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const insert = useCallback(
    async (row: Partial<T>): Promise<CRUDResult<T>> => {
      setLoading(true);
      setError(null);
      try {
        const res = await insertRow<T>(table, row as any, {
          select: options.select,
          idField: options.idField,
        });
        if (res.error) throw res.error;
        queryRefetch?.();
        options.onSuccess?.(res.data, { action: "insert" });
        return res;
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        setError(e);
        options.onError?.(e);
        return { data: null, error: e, count: null };
      } finally {
        setLoading(false);
      }
    },
    [table, queryRefetch, options.select, options.idField]
  );

  const update = useCallback(
    async (id: string, updates: Partial<T>): Promise<CRUDResult<T>> => {
      setLoading(true);
      setError(null);
      try {
        const res = await updateRow<T>(table, id, updates as any, {
          select: options.select,
          idField: options.idField,
        });
        if (res.error) throw res.error;
        queryRefetch?.();
        options.onSuccess?.(res.data, { action: "update" });
        return res;
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        setError(e);
        options.onError?.(e);
        return { data: null, error: e, count: null };
      } finally {
        setLoading(false);
      }
    },
    [table, queryRefetch, options.select, options.idField]
  );

  const remove = useCallback(
    async (id: string): Promise<{ error: Error | null; count: number | null }> => {
      setLoading(true);
      setError(null);
      try {
        const res = await deleteRow(table, id, { idField: options.idField });
        if (res.error) throw res.error;
        queryRefetch?.();
        options.onSuccess?.(null, { action: "delete" });
        return res;
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        setError(e);
        options.onError?.(e);
        return { error: e, count: null };
      } finally {
        setLoading(false);
      }
    },
    [table, queryRefetch, options.idField]
  );

  return useMemo(() => ({ insert, update, remove, loading, error }), [insert, update, remove, loading, error]);
}
