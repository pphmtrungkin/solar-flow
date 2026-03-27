"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

/**
 * Organization Members Page (Client Component)
 *
 * Uses authClient to fetch members of a specific organization.
 * Client-side fetching ensures session cookies are automatically handled
 * by the browser, avoiding 401 Unauthorized issues common in Server Components.
 */
export default function OrgMembersPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  // Better Auth listMembers returns an object with a members array
  // We initialize state as an empty array to avoid .length and .map errors
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMembers() {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);

        // Call Better Auth organization plugin via client SDK
        const { data, error: authError } =
          await authClient.organization.listMembers({
            query: {
              organizationId: id,
              limit: 100,
            },
          });

        if (authError) {
          setError(authError.message || "Failed to load members");
        } else {
          // data is { members: Member[], total: number }
          setMembers(data?.members || []);
        }
      } catch (err: any) {
        console.error("Unexpected error fetching members:", err);
        setError("An unexpected error occurred while fetching members.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchMembers();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-6">
        <div className="alert alert-error shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 space-y-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Organization Members
        </h1>
        <p className="text-sm text-base-content/60 font-mono">ID: {id}</p>
      </header>

      <div className="card bg-base-200 shadow-xl border border-base-300">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h2 className="card-title text-lg">
              Members List
              <div className="badge badge-secondary ml-2">{members.length}</div>
            </h2>
          </div>

          {members.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-base-content/50">
                No members found for this organization.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <ul className="divide-y divide-base-300">
                {members.map((member) => (
                  <li
                    key={member.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-2"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-base">
                        {member.user?.name || "Unnamed User"}
                      </span>
                      <span className="text-sm text-base-content/70">
                        {member.user?.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {member.role && (
                        <span className="badge badge-outline badge-md capitalize">
                          {member.role}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
