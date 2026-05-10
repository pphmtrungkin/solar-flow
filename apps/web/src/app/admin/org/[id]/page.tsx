"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  UserPlus,
  Mail,
  Shield,
  X,
  ArrowRight,
  CheckCircle2,
  Users,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { adminInviteMemberAction } from "@/actions/admin-actions";

interface OrgMember {
  id: string;
  role: string;
  user: {
    name: string;
    email: string;
  };
}

/**
 * Organization Members Page
 *
 * Manages the list of members for a specific organization and
 * provides functionality to invite new members using a sleek, modern interface.
 */
export default function OrgMembersPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [members, setMembers] = useState<OrgMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal and Invitation State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [isInviting, setIsInviting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchMembers = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
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
        setMembers(data?.members || []);
      }
    } catch (err: any) {
      setError("An unexpected error occurred while fetching members.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [id]);

  const handleAddMember = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inviteEmail || !id) return;

    setIsInviting(true);
    setError(null);
    try {
      const result = await adminInviteMemberAction({
        email: inviteEmail,
        organizationId: id,
        role: inviteRole,
      });

      if (!result || (result as any).error) {
        setError(
          (result as any)?.error?.message || "Failed to send invitation",
        );
      } else {
        setSuccessMessage(`Invitation successfully sent to ${inviteEmail}`);
        setInviteEmail("");
        fetchMembers();

        // Auto-close modal after success
        setTimeout(() => {
          setIsModalOpen(false);
          setSuccessMessage(null);
        }, 2000);
      }
    } catch (err: any) {
      setError(
        err.message || "An unexpected error occurred during invitation.",
      );
    } finally {
      setIsInviting(false);
    }
  };

  if (isLoading && members.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-base-100/50">
        <span className="loading loading-ring loading-lg text-primary scale-150" />
      </div>
    );
  }

  return (
    <div className="flex-1 w-full min-h-screen bg-base-100/50">
      <div className="max-w-5xl mx-auto px-6 py-12 lg:px-10 space-y-10">
        {/* Breadcrumb / Back Navigation */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] opacity-40 hover:opacity-100 hover:text-primary transition-all group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Organizations
        </Link>

        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-base-300 pb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
              <Users className="w-3 h-3" />
              Member Directory
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-base-content">
              Personnel
            </h1>
            <p className="text-sm font-mono opacity-40 truncate max-w-xs md:max-w-none">
              Registry ID: {id}
            </p>
          </div>
          <button
            className="btn btn-primary btn-lg shadow-2xl shadow-primary/20 gap-3 rounded-2xl normal-case hover:scale-[1.02] active:scale-[0.98] transition-all"
            onClick={() => setIsModalOpen(true)}
          >
            <UserPlus className="w-6 h-6" />
            Add Member
          </button>
        </header>

        {/* Members List Card */}
        <div className="card bg-base-100 border border-base-300 rounded-[2.5rem] shadow-sm overflow-hidden">
          <div className="card-body p-0">
            <div className="px-10 py-8 border-b border-base-200 flex items-center justify-between bg-base-200/30">
              <h2 className="text-2xl font-black tracking-tight text-base-content">
                Active Personnel
              </h2>
              <div className="text-[10px] font-black bg-base-300 px-4 py-2 rounded-full uppercase tracking-[0.2em] opacity-60">
                {members.length} Total
              </div>
            </div>

            {members.length === 0 ? (
              <div className="py-32 text-center space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-base-200 mx-auto flex items-center justify-center opacity-20">
                  <Users className="w-10 h-10" />
                </div>
                <p className="text-base-content/40 font-bold uppercase tracking-widest text-xs">
                  No members registered
                </p>
              </div>
            ) : (
              <div className="divide-y divide-base-200">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between px-10 py-8 hover:bg-base-200/50 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-[1.25rem] bg-base-200 flex items-center justify-center font-black text-xl text-primary group-hover:bg-primary group-hover:text-primary-content transition-all duration-500 shadow-inner">
                        {member.user.name?.charAt(0) ||
                          member.user.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col space-y-0.5">
                        <span className="font-black text-xl leading-tight group-hover:text-primary transition-colors">
                          {member.user.name || "Unnamed User"}
                        </span>
                        <span className="text-sm opacity-40 font-bold font-mono">
                          {member.user.email}
                        </span>
                      </div>
                    </div>
                    <div className="mt-6 sm:mt-0 flex items-center gap-4">
                      <span
                        className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border-none ${
                          member.role === "owner"
                            ? "bg-primary/10 text-primary"
                            : member.role === "admin"
                              ? "bg-secondary/10 text-secondary"
                              : "bg-base-200 text-base-content/40"
                        }`}
                      >
                        {member.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Member Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/90 backdrop-blur-md transition-opacity duration-500"
              onClick={() => !isInviting && setIsModalOpen(false)}
            />

            {/* Modal Box */}
            <div className="relative bg-base-100 border border-base-300 rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] w-full max-w-lg overflow-hidden z-10 transform transition-all duration-500">
              <div className="p-12 space-y-10">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-4xl font-black tracking-tighter text-base-content">
                      Invite
                    </h3>
                    <p className="text-xs font-black uppercase tracking-[0.2em] opacity-30">
                      New Organization Member
                    </p>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-ghost btn-md btn-square rounded-2xl hover:bg-base-200"
                  >
                    <X className="w-6 h-6 opacity-40" />
                  </button>
                </div>

                {successMessage ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center space-y-6 animate-in fade-in zoom-in duration-500">
                    <div className="w-24 h-24 rounded-xl bg-success/10 flex items-center justify-center text-success-content shadow-inner">
                      <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <div className="space-y-2">
                      <p className="font-black text-success text-2xl tracking-tight">
                        Success
                      </p>
                      <p className="text-sm font-bold opacity-50 max-w-50">
                        {successMessage}
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleAddMember} className="space-y-8">
                    <div className="space-y-3">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40 ml-2">
                        Recipient Email
                      </label>
                      <div className="relative group">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 opacity-20 group-focus-within:opacity-100 group-focus-within:text-primary transition-all" />
                        <input
                          type="email"
                          placeholder="name@company.com"
                          className="input input-bordered w-full pl-14 bg-base-200/50 border-none focus:ring-4 focus:ring-primary/10 transition-all rounded-[1.25rem] h-16 font-bold text-lg"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          required
                          autoFocus
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40 ml-2">
                        Access Level
                      </label>
                      <div className="relative group">
                        <Shield className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 opacity-20 group-focus-within:opacity-100 group-focus-within:text-primary transition-all" />
                        <select
                          className="select select-bordered w-full pl-14 bg-base-200/50 border-none focus:ring-4 focus:ring-primary/10 transition-all rounded-[1.25rem] h-16 font-black text-lg appearance-none"
                          value={inviteRole}
                          onChange={(e) => setInviteRole(e.target.value)}
                        >
                          <option value="member">Member</option>
                          <option value="admin">Admin</option>
                          <option value="owner">Owner</option>
                        </select>
                      </div>
                    </div>

                    {error && (
                      <div className="alert alert-error rounded-2xl border-none bg-error/10 text-error text-xs font-black uppercase tracking-widest py-4">
                        <X className="w-4 h-4" />
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="pt-6">
                      <button
                        type="submit"
                        disabled={isInviting || !inviteEmail}
                        className="btn btn-block h-20 btn-primary shadow-2xl shadow-primary/30 rounded-2xl font-black uppercase tracking-[0.2em] text-sm group/btn"
                      >
                        {isInviting ? (
                          <span className="loading loading-spinner loading-md" />
                        ) : (
                          <>
                            <span>Dispatch Invitation</span>
                            <ArrowRight className="w-6 h-6 ml-3 group-hover/btn:translate-x-2 transition-transform" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
