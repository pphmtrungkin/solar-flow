"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import AddOrgModal from "./AddOrgModal";
import { useState, useMemo } from "react";
import {
  Plus,
  Building2,
  Calendar,
  Database,
  Search,
  ArrowRight,
  MoreVertical,
  Filter,
} from "lucide-react";

/**
 * Admin Dashboard Page
 *
 * A sleek, centered, and modern interface for managing organizations.
 * Features:
 * - Real-time search/filtering
 * - High-density information cards
 * - Responsive grid layout
 * - Professional loading and empty states
 */
export default function AdminPage() {
  const { data: organizations, isPending } = authClient.useListOrganizations();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter organizations based on search query
  const filteredOrgs = useMemo(() => {
    if (!organizations) return [];
    return organizations.filter(
      (org) =>
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.slug.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [organizations, searchQuery]);

  return (
    <div className="flex-1 w-full min-h-screen bg-base-100/50">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:px-10 space-y-12">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8 border-b border-base-300 pb-10">
          <div className="text-center md:text-left space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
              <Building2 className="w-3 h-3" />
              System Registry
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-base-content">
              Organizations
            </h1>
            <p className="text-base-content/60 text-lg max-w-xl">
              Manage global business entities, monitor growth metrics, and
              control infrastructure access.
            </p>
          </div>
          <button
            className="btn btn-primary btn-lg shadow-2xl shadow-primary/30 gap-3 rounded-2xl normal-case hover:scale-[1.02] active:scale-[0.98] transition-all"
            onClick={() => setIsOpen(true)}
          >
            <Plus className="w-6 h-6" />
            New Organization
          </button>
        </header>

        {/* Modal Component */}
        <AddOrgModal isOpen={isOpen} setIsOpenAction={setIsOpen} />

        {/* Search and Filters Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-base-100 p-5 rounded-3xl border border-base-300 shadow-sm">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-30" />
            <input
              type="text"
              placeholder="Search by name or unique slug..."
              className="input input-bordered w-full pl-12 bg-base-200/50 border-none focus:ring-2 focus:ring-primary/20 transition-all rounded-2xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="btn btn-ghost btn-sm gap-2 opacity-60 hover:opacity-100 rounded-xl">
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <div className="divider divider-horizontal mx-0 hidden sm:flex"></div>
            <div className="text-xs font-black opacity-30 uppercase tracking-widest">
              {filteredOrgs.length} Records
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        {isPending ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-6">
            <span className="loading loading-ring loading-lg text-primary scale-[2]"></span>
            <div className="text-center space-y-1">
              <p className="text-xl font-black opacity-80 tracking-tight">
                Synchronizing
              </p>
              <p className="text-sm opacity-40 uppercase font-bold tracking-widest">
                Accessing Secure Database
              </p>
            </div>
          </div>
        ) : filteredOrgs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 px-6 bg-base-200/30 border-2 border-dashed border-base-300 rounded-[3rem] text-center">
            <div className="w-24 h-24 rounded-xl bg-base-300 flex items-center justify-center mb-8 shadow-inner">
              <Building2 className="w-12 h-12 opacity-10" />
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-black opacity-80 tracking-tight">
                {searchQuery ? "No matches found" : "Empty Registry"}
              </h3>
              <p className="text-base-content/50 max-w-sm mx-auto text-lg">
                {searchQuery
                  ? `We couldn't find any organizations matching "${searchQuery}".`
                  : "There are currently no organizations registered in the system. Start by creating your first business entity."}
              </p>
            </div>
            {!searchQuery && (
              <button
                className="btn btn-primary btn-outline mt-10 rounded-2xl px-10 h-14"
                onClick={() => setIsOpen(true)}
              >
                Create Organization
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredOrgs.map((org) => (
              <div
                key={org.id}
                className="group relative bg-base-100 border border-base-300 rounded-2xl hover:border-primary/40 hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] transition-all duration-500 overflow-hidden"
              >
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />

                <div className="p-8 space-y-8 relative z-10">
                  {/* Org Identity */}
                  <div className="flex items-start justify-start">
                    <div>
                      <h3
                        className="font-black text-xl group-hover:text-primary transition-colors duration-300"
                        title={org.name}
                      >
                        {org.name}
                      </h3>
                      <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
                        <Database className="w-3.5 h-3.5" />
                        <span className="truncate">{org.slug}</span>
                      </div>
                    </div>
                    <button className="btn btn-ghost btn-xs btn-square opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Info Grid */}
                  <div className="space-y-4 py-6 border-y border-base-200/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 text-xs opacity-50 font-black uppercase tracking-tighter">
                        <Calendar className="w-4 h-4" />
                        Registered
                      </div>
                      <span className="text-xs font-bold bg-base-200 px-3 py-1.5 rounded-xl">
                        {new Date(org.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Metadata Tag */}
                  {org.metadata ? (
                    <div className="bg-base-200/50 rounded-2xl p-4 text-xs font-medium opacity-70 border border-base-300/50">
                      <p className="line-clamp-2 italic leading-relaxed">
                        "{org.metadata}"
                      </p>
                    </div>
                  ) : (
                    <div className="h-14.5 flex items-center justify-center border border-dashed border-base-300 rounded-2xl opacity-20">
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        No Metadata
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-2">
                    <Link
                      href={`/admin/org/${org.id}`}
                      className="btn btn-block btn-lg bg-base-200 hover:bg-primary hover:text-primary-content border-none rounded-2xl transition-all duration-300 group/btn font-black text-sm"
                    >
                      <span>Manage Members</span>
                      <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Info */}
        {!isPending && filteredOrgs.length > 0 && (
          <footer className="pt-16 text-center">
            <div className="inline-flex items-center gap-4 opacity-20">
              <div className="h-px w-12 bg-base-content"></div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em]">
                SolarFlow Administrative Registry
              </p>
              <div className="h-px w-12 bg-base-content"></div>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}
