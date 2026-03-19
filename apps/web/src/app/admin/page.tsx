"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

interface Organization {
  id: string;
  name: string;
  slug: string;
  createdAt: string | Date;
  logo?: string | null;
  metadata?: string | null;
}

// Admin page: list all organizations as DaisyUI cards
export default function Page() {
  const router = useRouter();
  const {
    data: session,
    error: sessionError,
    isPending,
  } = authClient.useSession();

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loadingOrgs, setLoadingOrgs] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Gate page to admins only
  useEffect(() => {
    if (isPending) return;

    if (sessionError) {
      setErrorMsg(sessionError.message ?? "Failed to load session");
      router.replace("/login");
      return;
    }

    if (!session?.user) {
      router.replace("/login");
      return;
    }

    const user = session.user as any;
    const isAdmin =
      user.role === "ADMIN" ||
      user.role === "admin" ||
      (Array.isArray(user.roles) && user.roles.includes("admin"));

    if (!isAdmin) {
      router.replace("/");
      return;
    }
  }, [isPending, session, sessionError, router]);

  // Fetch organizations
  useEffect(() => {
    if (!session?.user) return;

    const fetchOrganizations = async () => {
      try {
        setLoadingOrgs(true);
        setErrorMsg(null);

        const res = await fetch(
          process.env.NEXT_PUBLIC_SERVER_URL + "/admin/organizations",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "x-requested-with": "admin-page",
            },
          },
        );

        if (!res.ok) {
          const text = await res.text();
          setErrorMsg(`Failed to fetch organizations: ${res.status} ${text}`);
          return;
        }

        const json = await res.json();
        const orgs = (json.organizations ?? json) as Organization[];
        console.log(orgs);
        setOrganizations(orgs);
      } catch (err: any) {
        setErrorMsg(err?.message ?? "Unknown error");
      } finally {
        setLoadingOrgs(false);
      }
    };

    fetchOrganizations();
  }, [session?.user]);

  if (isPending || loadingOrgs) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span
          className="loading loading-spinner"
          aria-label="Loading organizations"
        />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6 space-y-4">
      <header>
        <h2 className="text-2xl font-bold">Admin – Organizations</h2>
        <p className="text-sm text-base-content/70">
          List of all organizations in the system.
        </p>
      </header>
      <button className="btn btn-primary">Add Organization</button>
      {errorMsg && (
        <div className="alert alert-error">
          <span>{errorMsg}</span>
        </div>
      )}
      {/* apps/web/src/app/admin/page.tsx (render section) */}
      {organizations.length === 0 ? (
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body">
            <h3 className="card-title mb-2">Organizations</h3>
            <p className="text-sm text-base-content/70">
              No organizations found.
            </p>
          </div>
        </div>
      ) : (
        // 1 col on mobile, 2 on small screens, 4 from md and up
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {organizations.map((org) => (
            <div key={org.id} className="card bg-base-200 shadow-sm">
              <div className="card-body p-4 space-y-2">
                <h3 className="card-title text-sm">{org.name}</h3>
                <p className="text-[0.7rem] text-base-content/70">
                  Slug: <span className="font-mono">{org.slug}</span>
                </p>
                <p className="text-[0.7rem] text-base-content/70">
                  Created:{" "}
                  {new Date(org.createdAt).toLocaleString(undefined, {
                    dateStyle: "short",
                  })}
                </p>
                {org.metadata && (
                  <p className="text-[0.7rem] text-base-content/60">
                    Metadata: {org.metadata}
                  </p>
                )}

                <div className="card-actions justify-end mt-2">
                  <button
                    type="button"
                    className="btn btn-xs btn-primary"
                    onClick={() => {
                      console.log("View org", org.id);
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
