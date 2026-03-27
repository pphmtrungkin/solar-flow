import React from "react";
import { type LucideIcon, Sun } from "lucide-react";
import Link from "next/link";

export interface SidebarItem {
  label: string;
  href?: string;
  icon?: LucideIcon;
  badge?: string | number;
  active?: boolean;
  type?: "link" | "title"; // "title" for section headers
}

interface SidebarProps {
  children: React.ReactNode;
  checkboxId: string;
  title?: string;
  subtitle?: string;
  headerIcon?: React.ReactNode;
  items: SidebarItem[];
}

/**
 * Reusable Sidebar component using DaisyUI Drawer
 *
 * @param children - The main content to be rendered alongside the sidebar
 * @param checkboxId - Unique ID for the drawer toggle
 * @param title - Main title shown in the header
 * @param subtitle - Subtitle shown in the header
 * @param headerIcon - Icon component or element shown in the header
 * @param items - Array of navigation items and section titles
 */
export default function Sidebar({
  children,
  checkboxId,
  title = "Solar Sales",
  subtitle = "CRM System",
  headerIcon = <Sun className="h-8 w-8 text-primary-content" />,
  items,
}: SidebarProps) {
  return (
    <div className="drawer lg:drawer-open">
      <input id={checkboxId} type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">{children}</div>
      <div className="drawer-side z-40">
        <label
          htmlFor={checkboxId}
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 min-h-full w-80 p-4">
          {/* Sidebar Header */}
          <li className="menu-title mb-4">
            <div className="flex items-center gap-3 px-2 py-4">
              <div className="w-12 h-12 rounded-lg bg-linear-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                {headerIcon}
              </div>
              <div className="overflow-hidden">
                <h2 className="font-bold text-xl truncate">{title}</h2>
                <p className="text-sm opacity-60 truncate">{subtitle}</p>
              </div>
            </div>
          </li>

          {/* Dynamic Navigation Items */}
          {items.map((item, index) => {
            if (item.type === "title") {
              return (
                <li
                  key={`title-${index}`}
                  className="menu-title mt-4 first:mt-0"
                >
                  {item.label}
                </li>
              );
            }

            const Icon = item.icon;
            return (
              <li key={`item-${index}`}>
                <Link
                  href={(item.href || "#") as any}
                  className={`${item.active ? "active" : ""} text-base flex items-center gap-3`}
                >
                  {Icon && <Icon className="h-5 w-5" />}
                  <span className="flex-1">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="badge badge-primary badge-sm">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
