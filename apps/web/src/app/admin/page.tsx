"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import AddOrgModal from "./AddOrgModal";
import { useState } from "react";

/**
 * Admin page: list all organizations as DaisyUI cards
 *
 * Note: We removed explicit z-index from cards to prevent stacking context
 * issues with the AddOrgModal.
 */
export default function Page() {
  const { data: organizations } = authClient.useListOrganizations();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Admin – Organizations</h2>
          <p className="text-sm text-base-content/70">
            List of all organizations in the system.
          </p>
        </div>
        <button
          className="btn btn-sm btn-ghost"
          onClick={() => setIsOpen(true)}
        >
          <span className="sr-only">Add Organization</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <AddOrgModal isOpen={isOpen} setIsOpen={setIsOpen} />
      </header>

      {/* Organizations List Section */}
      {!organizations || organizations.length === 0 ? (
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body items-center py-10">
            <h3 className="card-title opacity-50">No Organizations Found</h3>
            <p className="text-sm text-base-content/60">
              Create your first organization using the button above.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {organizations.map((org) => (
            <div
              key={org.id}
              className="card bg-base-200 shadow-sm hover:shadow-md transition-all duration-200 border border-base-300"
            >
              <div className="card-body p-4 space-y-3">
                <div>
                  <h3 className="card-title text-sm truncate" title={org.name}>
                    {org.name}
                  </h3>
                  <p className="text-[0.7rem] font-mono opacity-60 truncate">
                    {org.slug}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-[0.65rem] uppercase font-bold opacity-40">
                    Created
                  </p>
                  <p className="text-[0.7rem]">
                    {new Date(org.createdAt).toLocaleDateString(undefined, {
                      dateStyle: "medium",
                    })}
                  </p>
                </div>

                {org.metadata && (
                  <div className="space-y-1">
                    <p className="text-[0.65rem] uppercase font-bold opacity-40">
                      Metadata
                    </p>
                    <p className="text-[0.7rem] truncate italic">
                      {org.metadata}
                    </p>
                  </div>
                )}

                <div className="card-actions justify-end pt-2 border-t border-base-300">
                  <Link
                    href={`/admin/org/${org.id}`}
                    className="btn btn-xs btn-primary btn-outline"
                  >
                    Manage Members
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
