import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { createClient } from "@/lib/supabase/server";
import { APP_ROLES, type AppRole } from "@/lib/constants";
import { setStoredRole } from "@/components/shared/role-gate";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user: { email?: string | null; fullName?: string | null; avatarUrl?: string | null; role?: AppRole | null } | null = null;
  let userRole: AppRole | null = null;

  try {
    const supabase = createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (authUser) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, role, avatar_url")
        .eq("id", authUser.id)
        .single();

      const role: AppRole | null = (profile?.role as AppRole) || APP_ROLES.VOCALIST;
      userRole = role;

      user = {
        email: authUser.email ?? null,
        fullName: profile?.full_name ?? authUser.email ?? null,
        avatarUrl: profile?.avatar_url ?? null,
        role,
      };
    }
  } catch {
    // Supabase URL yoksa demo modda çalış
    user = null;
    userRole = null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar userRole={userRole} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar user={user} />
        <main className="flex-1 p-4 md:p-8 min-w-0">
          <div className="mx-auto max-w-[1600px] animate-slide-up">{children}</div>
        </main>
      </div>
    </div>
  );
}
