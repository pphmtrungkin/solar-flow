import Sidebar from "@/components/side-bar";
import { Home, Settings, Users, ShieldCheck } from "lucide-react";
import { type SidebarItem } from "@/components/side-bar";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@solar-sales/auth";
import TopNav from "@/components/top-bar";

const sidebarItems: SidebarItem[] = [
  { label: "Management", type: "title" },
  { label: "Users", icon: Home, href: "/" },
  { label: "Organizations", icon: Users, href: "/admin" },
  { label: "System", type: "title" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

/**
 * Admin Layout
 *
 * Performs server-side session and role checks to ensure only
 * authenticated admins can access any routes under /admin/*.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hdrs = await headers();
  const session = await auth.api.getSession({
    headers: hdrs,
  });

  // 1. Check if user is logged in
  if (!session?.user) {
    redirect("/login");
  }

  // 2. Check if user is an admin
  // Better Auth roles can be on user.role or user.roles depending on plugin config
  const user = session.user as any;
  const isAdmin =
    user.role === "admin" ||
    user.role === "ADMIN" ||
    (Array.isArray(user.roles) && user.roles.includes("admin"));

  if (!isAdmin) {
    redirect("/");
  }

  return (
    <section className="w-full">
      <Sidebar
        checkboxId="admin-drawer"
        items={sidebarItems}
        title="Admin Portal"
        subtitle="System Control"
        headerIcon={<ShieldCheck className="h-8 w-8 text-primary-content" />}
      >
        <TopNav checkboxId="admin-drawer" />
        {children}
      </Sidebar>
    </section>
  );
}
