import Image from "next/image";
import { Menu, Bell } from "lucide-react";

export default function TopNav({ checkboxId }: { checkboxId: string }) {
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
        <a className="btn btn-ghost text-xl">Company Name</a>
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
            className="card card-compact dropdown-content bg-base-100 z-1 mt-3 w-52 shadow"
          >
            <div className="card-body">
              <span className="text-lg font-bold">8 Items</span>
              <span className="text-info">Subtotal: $999</span>
              <div className="card-actions">
                <button className="btn btn-primary btn-block">View cart</button>
              </div>
            </div>
          </div>
        </div>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <Image
                alt="Profile Picture"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                width={400}
                height={400}
              />
            </div>
          </div>
          <ul
            tabIndex={-1}
            className="menu menu-md dropdown-content z-1 mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
