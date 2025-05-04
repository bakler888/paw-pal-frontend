
import React from "react";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { X, Home, Cow, Tool, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar = ({ open, setOpen }: SidebarProps) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar dark:bg-sidebar transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-14 items-center justify-between px-4 border-b border-sidebar-border">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-sidebar-foreground mr-2"
          >
            <path d="M3 9a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-9z" />
            <path d="M9 16h6" />
            <path d="M13 9a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-9z" />
            <path d="M8 7v-4" />
            <path d="M18 7v-4" />
          </svg>
          <h1 className="text-lg font-semibold text-sidebar-foreground">
            FarmCare
          </h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-sidebar-foreground"
          onClick={() => setOpen(false)}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="px-3 py-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-sidebar-foreground/70 mb-2 px-2">
              DASHBOARD
            </p>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )
              }
              end
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </NavLink>

            <p className="text-xs font-medium text-sidebar-foreground/70 mt-6 mb-2 px-2">
              FARM MANAGEMENT
            </p>
            <NavLink
              to="/animals"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )
              }
            >
              <Cow className="h-4 w-4" />
              <span>Animals</span>
            </NavLink>
            <NavLink
              to="/care-tools"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )
              }
            >
              <Tool className="h-4 w-4" />
              <span>Care Tools</span>
            </NavLink>

            <p className="text-xs font-medium text-sidebar-foreground/70 mt-6 mb-2 px-2">
              ANALYTICS
            </p>
            <NavLink
              to="/reports"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )
              }
            >
              <BarChart3 className="h-4 w-4" />
              <span>Reports</span>
            </NavLink>
          </div>
        </div>
      </ScrollArea>
      <div className="p-3 border-t border-sidebar-border">
        <p className="text-xs text-sidebar-foreground/70">
          &copy; {new Date().getFullYear()} FarmCare
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
