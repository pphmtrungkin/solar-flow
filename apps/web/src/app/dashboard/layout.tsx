"use server";

import Sidebar, { type SidebarItem } from "@/components/side-bar";
import TopNav from "@/components/top-bar";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@solar-sales/auth";
import { Home, Users, Settings } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hdrs = await headers();
  const session = await auth.api.getSession({ headers: hdrs });

  if (!session?.user) {
    redirect("/auth/login");
  }

  // // No active org → your no-org / select-org page
  // if (!session.session?.activeOrganizationId) {
  //   redirect("/no-org"); // or "/select-org"
  // }

  const drawerId = "dashboard-drawer";

  const navItems: SidebarItem[] = [
    { label: "Main", type: "title" },
    { label: "Dashboard", href: "/dashboard", icon: Home, active: true },
    { label: "Team", href: "/team", icon: Users, badge: 3 },
    { label: "System", type: "title" },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <section className="w-full">
      <Sidebar checkboxId={drawerId} items={navItems}>
        <TopNav checkboxId={drawerId} />
        {children}
      </Sidebar>
    </section>
  );
}
