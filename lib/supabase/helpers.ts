import { supabase } from "./client";
import { generateId } from "../utils";
import { STORAGE_BUCKETS } from "../constants";
import type { StorageBucket } from "../constants";

export type UploadResult = {
  publicUrl: string | null;
  error: Error | null;
  path: string | null;
};

export function isSupabaseReady(): boolean {
  if (typeof window === "undefined") return false;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return false;
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return false;
  if (!supabase) return false;
  return true;
}

export function assertSupabase(): typeof supabase | null {
  if (!isSupabaseReady()) return null;
  return supabase;
}

const BUCKET_KEYS = Object.keys(STORAGE_BUCKETS) as (keyof typeof STORAGE_BUCKETS)[];
const BUCKET_VALUES = Object.values(STORAGE_BUCKETS) as StorageBucket[];

function storageBucketId(bucket: string): StorageBucket | string {
  const asKey = BUCKET_KEYS.find((k) => k === bucket);
  if (asKey) return STORAGE_BUCKETS[asKey];
  const asValue = BUCKET_VALUES.find((v) => v === (bucket as StorageBucket));
  if (asValue) return asValue;
  return bucket;
}

export async function uploadToStorage(
  bucket: string,
  path: string,
  file: File,
  options: { upsert?: boolean; contentType?: string } = {}
): Promise<UploadResult> {
  const sb = assertSupabase();
  if (!sb) {
    return {
      publicUrl: URL.createObjectURL(file),
      error: null,
      path: null,
    };
  }
  try {
    const bucketId = storageBucketId(bucket);
    const { error } = await sb.storage.from(bucketId).upload(path, file, {
      upsert: options.upsert ?? true,
      contentType: options.contentType ?? file.type,
    });
    if (error) throw error;
    const { data } = sb.storage.from(bucketId).getPublicUrl(path);
    return {
      publicUrl: data.publicUrl,
      error: null,
      path,
    };
  } catch (err) {
    console.error("storage upload failed:", err);
    return {
      publicUrl: null,
      error: err instanceof Error ? err : new Error(String(err)),
      path: null,
    };
  }
}

export function getStoragePublicUrl(bucket: string, path: string): string | null {
  const sb = assertSupabase();
  if (!sb || !path) return null;
  try {
    const bucketId = storageBucketId(bucket);
    const { data } = sb.storage.from(bucketId).getPublicUrl(path);
    return data.publicUrl;
  } catch {
    return null;
  }
}

export type CRUDResult<T> = {
  data: T | null;
  error: Error | null;
  count: number | null;
};

export async function selectAll<T = unknown>(
  table: string,
  options: {
    select?: string;
    filters?: Array<{ field: string; op: "eq" | "neq" | "ilike" | "gte" | "lte" | "in" | "contains"; value: unknown }>;
    order?: { field: string; ascending?: boolean; nullsFirst?: boolean };
    limit?: number;
    offset?: number;
    fallback?: T[];
  } = {}
): Promise<{ data: T[]; error: Error | null; count: number | null }> {
  const sb = assertSupabase();
  if (!sb) {
    return { data: (options.fallback as T[]) ?? [], error: null, count: options.fallback?.length ?? 0 };
  }
  try {
    let q = sb.from(table).select(options.select ?? "*", { count: "exact" });
    for (const f of options.filters ?? []) {
      switch (f.op) {
        case "eq":
          q = q.eq(f.field, f.value as string | number | boolean);
          break;
        case "neq":
          q = q.neq(f.field, f.value as string | number | boolean);
          break;
        case "ilike":
          q = q.ilike(f.field, `%${String(f.value)}%`);
          break;
        case "gte":
          q = q.gte(f.field, f.value as string | number);
          break;
        case "lte":
          q = q.lte(f.field, f.value as string | number);
          break;
        case "in":
          q = q.in(f.field, f.value as string[]);
          break;
        case "contains":
          q = q.contains(f.field, f.value as unknown as string[]);
          break;
      }
    }
    if (options.order) {
      q = q.order(options.order.field, {
        ascending: options.order.ascending ?? false,
        nullsFirst: options.order.nullsFirst ?? false,
      });
    }
    if (options.limit) q = q.limit(options.limit);
    if (options.offset != null && options.limit != null) {
      q = q.range(options.offset, options.offset + options.limit - 1);
    } else if (options.offset != null) {
      q = q.range(options.offset, options.offset + 499);
    }
    const { data, error, count } = (await q) as unknown as {
      data: T[];
      error: Error | null;
      count: number | null;
    };
    if (error) throw error;
    return { data: data ?? [], error: null, count };
  } catch (err) {
    console.error(`supabase selectAll ${table} failed:`, err);
    return {
      data: (options.fallback as T[]) ?? [],
      error: err instanceof Error ? err : new Error(String(err)),
      count: options.fallback?.length ?? null,
    };
  }
}

export async function selectOne<T = unknown>(
  table: string,
  id: string,
  options: { select?: string; idField?: string; fallback?: T | null } = {}
): Promise<{ data: T | null; error: Error | null }> {
  const sb = assertSupabase();
  if (!sb) {
    return { data: (options.fallback as T) ?? null, error: null };
  }
  try {
    const idField = options.idField ?? "id";
    const { data, error } = (await sb
      .from(table)
      .select(options.select ?? "*")
      .eq(idField, id)
      .limit(1)
      .maybeSingle()) as unknown as {
      data: T | null;
      error: Error | null;
    };
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error(`supabase selectOne ${table}#${id} failed:`, err);
    return {
      data: (options.fallback as T) ?? null,
      error: err instanceof Error ? err : new Error(String(err)),
    };
  }
}

export async function insertRow<T = unknown>(
  table: string,
  row: Partial<Record<string, unknown>>,
  options: { select?: string; fallback?: T | null; idField?: string } = {}
): Promise<CRUDResult<T>> {
  const sb = assertSupabase();
  if (!sb) {
    const id = options.idField === "id" || !options.idField ? generateId() : String(row[options.idField] ?? generateId());
    return {
      data: { id, ...row } as unknown as T,
      error: null,
      count: 1,
    };
  }
  try {
    const { data, error } = (await sb
      .from(table)
      .insert(row as Record<string, unknown>)
      .select(options.select ?? "*")
      .maybeSingle()) as unknown as {
      data: T | null;
      error: Error | null;
    };
    if (error) throw error;
    return { data, error: null, count: data ? 1 : 0 };
  } catch (err) {
    console.error(`supabase insertRow ${table} failed:`, err);
    return {
      data: (options.fallback as T) ?? null,
      error: err instanceof Error ? err : new Error(String(err)),
      count: null,
    };
  }
}

export async function updateRow<T = unknown>(
  table: string,
  id: string,
  updates: Partial<Record<string, unknown>>,
  options: { select?: string; idField?: string; fallback?: T | null } = {}
): Promise<CRUDResult<T>> {
  const sb = assertSupabase();
  if (!sb) {
    return {
      data: (options.fallback as T) ?? null,
      error: null,
      count: 1,
    };
  }
  try {
    const idField = options.idField ?? "id";
    const { data, error } = (await sb
      .from(table)
      .update(updates as Record<string, unknown>)
      .eq(idField, id)
      .select(options.select ?? "*")
      .maybeSingle()) as unknown as {
      data: T | null;
      error: Error | null;
    };
    if (error) throw error;
    return { data, error: null, count: data ? 1 : 0 };
  } catch (err) {
    console.error(`supabase updateRow ${table}#${id} failed:`, err);
    return {
      data: (options.fallback as T) ?? null,
      error: err instanceof Error ? err : new Error(String(err)),
      count: null,
    };
  }
}

export async function deleteRow(
  table: string,
  id: string,
  options: { idField?: string } = {}
): Promise<{ error: Error | null; count: number | null }> {
  const sb = assertSupabase();
  if (!sb) {
    return { error: null, count: 1 };
  }
  try {
    const idField = options.idField ?? "id";
    const { error, count } = await sb.from(table).delete({ count: "exact" }).eq(idField, id);
    if (error) throw error;
    return { error: null, count: count ?? null };
  } catch (err) {
    console.error(`supabase deleteRow ${table}#${id} failed:`, err);
    return {
      error: err instanceof Error ? err : new Error(String(err)),
      count: null,
    };
  }
}
