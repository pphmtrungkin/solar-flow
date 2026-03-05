import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import Sidebar from "@/components/side-bar";
import TopNav from "@/components/top-bar";
import { SessionProvider } from "./session";

export default async function DashboardPage({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const DrawerId = "dashboard-drawer";

  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
      throw: true,
    },
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <section className="w-full">
      <SessionProvider value={session}>
        <Sidebar checkboxId={DrawerId}>
          <TopNav checkboxId={DrawerId} />
          {children}
        </Sidebar>
      </SessionProvider>
    </section>
  );
}
