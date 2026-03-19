"use server";

import Sidebar from "@/components/side-bar";
import TopNav from "@/components/top-bar";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@solar-sales/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hdrs = await headers();
  const session = await auth.api.getSession({ headers: hdrs });

  if (!session?.user) {
    redirect("/login");
  }

  // No active org → your no-org / select-org page
  if (!session.session?.activeOrganizationId) {
    redirect("/no-org"); // or "/select-org"
  }

  const drawerId = "dashboard-drawer";

  return (
    <section className="w-full">
      <Sidebar checkboxId={drawerId}>
        <TopNav checkboxId={drawerId} />
        {children}
      </Sidebar>
    </section>
  );
}
