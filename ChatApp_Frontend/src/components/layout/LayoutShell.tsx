import React, { useState, useEffect, createContext } from "react";
import Sidebar from "../Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";

const SIDEBAR_WIDTH_EXPANDED = "w-80";
const SIDEBAR_WIDTH_COLLAPSED = "w-16";

const LayoutShell: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  // Hide sidebar on auth pages
  const hideSidebar = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/verify-otp",
  ].some((path) => location.pathname.startsWith(path));

  return (
    <div className={`h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Hamburger for mobile */}
      {!hideSidebar && (
        <button
          className={`lg:hidden fixed top-4 left-4 z-40 p-2 rounded-md shadow transition-colors ${
            isDark
              ? "bg-gray-800 text-white hover:bg-gray-700"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      )}
      {/* Sidebar overlay for mobile */}
      {!hideSidebar && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Sidebar */}
      {!hideSidebar && (
        <div
          className={`fixed left-0 top-0 h-screen z-50 transition-all duration-200
            ${
              isSidebarCollapsed
                ? SIDEBAR_WIDTH_COLLAPSED
                : SIDEBAR_WIDTH_EXPANDED
            }
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0 lg:z-30 lg:block ${
              isDark ? "bg-gray-800" : "bg-white"
            }
          `}
          style={{
            boxShadow: sidebarOpen ? "0 0 0 9999px rgba(0,0,0,0.4)" : undefined,
          }}
        >
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            isDark={isDark}
            onToggleTheme={toggleTheme}
          />
          {/* Close button for mobile */}
          <button
            className={`lg:hidden absolute top-4 right-4 p-2 rounded-md transition-colors ${
              isDark
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
      {/* Main Content */}
      <div
        className={`min-h-screen flex-1 transition-all duration-200 flex flex-col
          ${!hideSidebar && (isSidebarCollapsed ? "lg:ml-16" : "lg:ml-80")}
        `}
      >
        <div className="flex flex-col min-h-screen">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export { LayoutShell };
