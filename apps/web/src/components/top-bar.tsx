"use client";

import Image from "next/image";
import { Menu, Bell } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

/**
 * TopNav Component
 *
 * Provides the top navigation bar with a mobile menu toggle,
 * notifications, and user profile dropdown.
 *
 * Converted to a Client Component to handle interactivity (Logout).
 */
export default function TopNav({ checkboxId }: { checkboxId: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await authClient.signOut();

    if (error) {
      console.error("Logout failed:", error);
    } else {
      router.push("/auth/login");
      router.refresh();
    }
  };

  return (
    <div className="navbar bg-base-200 shadow-lg rounded-md px-4">
      <div className="flex-none">
        <label
          htmlFor={checkboxId}
          className="btn btn-square btn-ghost lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </label>
      </div>
      <div className="flex-1">
        <a className="btn btn-ghost text-xl font-black tracking-tight">
          SolarFlow
        </a>
      </div>

      {/* Right side: notification + avatar */}
      <div className="flex-none flex items-center gap-x-2">
        {/* Notification dropdown */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <div className="indicator relative">
              <span className="indicator-item inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
              <Bell className="h-5 w-5" />
            </div>
          </div>
          <div
            tabIndex={0}
            className="card card-compact dropdown-content bg-base-100 z-1 mt-3 w-52 shadow-xl border border-base-300"
          >
            <div className="card-body">
              <span className="text-sm font-bold">Notifications</span>
              <p className="text-xs opacity-60">
                You have no new notifications.
              </p>
            </div>
          </div>
        </div>

        {/* User Profile Dropdown */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full overflow-hidden border-2 border-base-300">
              <Image
                alt="Profile Picture"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                width={40}
                height={40}
              />
            </div>
          </div>
          <ul
            tabIndex={-1}
            className="menu menu-md dropdown-content z-1 mt-3 p-2 shadow-2xl bg-base-100 rounded-box w-52 border border-base-300"
          >
            <li className="menu-title px-4 py-2 opacity-40 text-[10px] uppercase font-black tracking-widest">
              Account
            </li>
            <li>
              <a className="justify-between">
                Profile
                <span className="badge badge-sm badge-primary">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <div className="divider my-1 opacity-20"></div>
            <li>
              <button
                onClick={handleLogout}
                className="text-error hover:bg-error/10 font-bold"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
