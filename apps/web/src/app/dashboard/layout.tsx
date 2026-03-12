"use client";

import React from "react";
import Sidebar from "@/components/side-bar";
import TopNav from "@/components/top-bar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
