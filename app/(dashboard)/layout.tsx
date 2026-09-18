"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { useProfile } from "@/lib/hooks/use-profile";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { role: userRole, profile, user } = useProfile();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar userRole={userRole} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar user={user ? { email: user.email, fullName: profile?.full_name ?? user.email, avatarUrl: profile?.avatar_url ?? null, role: userRole } : null} />
        <main className="flex-1 p-4 md:p-8 min-w-0">
          <div className="mx-auto max-w-[1600px] animate-slide-up">{children}</div>
        </main>
      </div>
    </div>
  );
}
