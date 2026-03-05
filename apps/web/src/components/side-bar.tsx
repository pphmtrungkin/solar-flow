import {
  Home,
  Calendar,
  Users,
  UserPlus,
  ClipboardList,
  BarChart3,
  Settings,
  Sun,
} from "lucide-react";

export default function Sidebar({
  children,
  checkboxId,
}: {
  children: React.ReactNode;
  checkboxId: string;
}) {
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
          <li className="menu-title">
            <div className="flex items-center gap-3 px-2 py-4">
              <div className="w-12 h-12 rounded-lg bg-linear-to-br from-primary to-secondary flex items-center justify-center">
                <Sun className="h-8 w-8 text-primary-content" />
              </div>
              <div>
                <h2 className="font-bold text-xl">Solar Sales</h2>
                <p className="text-sm opacity-60">CRM System</p>
              </div>
            </div>
          </li>

          {/* Main Navigation */}
          <li className="menu-title">Main</li>
          <li>
            <a className="active text-base">
              <Home className="h-6 w-6" />
              Dashboard
            </a>
          </li>
          <li>
            <a className="text-base">
              <Calendar className="h-6 w-6" />
              Calendar
            </a>
          </li>

          {/* Sales Section */}
          <li className="menu-title">Sales</li>
          <li>
            <a className="text-base">
              <UserPlus className="h-6 w-6" />
              Leads
              <span className="badge badge-primary badge-sm">12</span>
            </a>
          </li>
          <li>
            <a className="text-base">
              <Users className="h-6 w-6" />
              Customers
            </a>
          </li>

          <li>
            <a className="text-base">
              <ClipboardList className="h-6 w-6" />
              Installations
            </a>
          </li>
          <li>
            <a className="text-base">
              <BarChart3 className="h-6 w-6" />
              Analytics
            </a>
          </li>

          {/* System Section */}
          <li className="menu-title">System</li>
          <li>
            <a className="text-base">
              <Settings className="h-6 w-6" />
              Settings
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
