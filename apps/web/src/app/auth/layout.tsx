"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@solar-sales/auth";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hdrs = await headers();

  const session = await auth.api.getSession({ headers: hdrs });

  // if (session?.user) {
  //   redirect("/");
  // }

  return <div>{children}</div>;
}
