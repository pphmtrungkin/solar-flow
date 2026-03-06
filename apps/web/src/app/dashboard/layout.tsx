import Sidebar from "@/components/side-bar";
import TopNav from "@/components/top-bar";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const DrawerId = "dashboard-drawer";

  return (
    <section className="w-full">
      <Sidebar checkboxId={DrawerId}>
        <TopNav checkboxId={DrawerId} />
        {children}
      </Sidebar>
    </section>
  );
}
