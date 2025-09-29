"use client";
import React from "react";
import PropTypes from "prop-types";
import { Bell, User } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

/**
 * Header
 * - accessible, keyboardable, defensive defaults, prop-validated.
 */
function Header({
  userName,
  goalsCount,
  streakDays,
  notificationsCount,
  onNotificationsClick,
}) {
  return (
    <header
      className="flex items-center justify-between px-6 py-3
        bg-gradient-to-r from-indigo-500/90 via-indigo-600/90 to-indigo-700/90
        backdrop-blur-md shadow-md sticky top-0 z-20 border-b border-indigo-400/30"
      role="banner"
    >
      {/* LEFT: Avatar + Breadcrumb */}
      <div className="flex items-center space-x-4">
        {/* User Avatar + Username */}
        <div className="flex items-center space-x-2">
          <div
            className="w-9 h-9 rounded-full bg-indigo-200/30 flex items-center justify-center shadow-sm"
            aria-hidden="true"
            title={userName}
          >
            <User className="w-5 h-5 text-white" aria-hidden="true" />
          </div>

          <span className="font-medium text-white text-sm" aria-label={`Signed in as ${userName}`}>
            {userName}
          </span>
        </div>

        {/* Breadcrumb — keep shadcn component as-is for accessible semantics */}
        <nav aria-label="Breadcrumb">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink
                  href="#"
                  className="text-indigo-200 hover:text-white transition-colors"
                >
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator className="hidden md:block text-indigo-200/70" />

              <BreadcrumbItem>
                <BreadcrumbPage className="text-white font-medium">Study Goals</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </nav>
      </div>

      {/* RIGHT: Goals / Streak / Notifications */}
      <div className="flex items-center space-x-4">
        {/* Goals Card (informational) */}
        <div
          role="status"
          aria-label={`Goals: ${goalsCount}`}
          className="bg-indigo-400/30 border border-indigo-300/40 rounded-lg px-3 py-1.5 text-center shadow-sm
                     hover:shadow-lg hover:shadow-indigo-500/40 hover:scale-105 transition duration-200 motion-reduce:transition-none motion-reduce:hover:transform-none"
        >
          <span className="text-xs text-indigo-100 block">Goals</span>
          <div className="font-semibold text-white text-sm" aria-hidden="true">{goalsCount}</div>
        </div>

        {/* Streak Card (informational) */}
        <div
          role="status"
          aria-label={`Streak: ${streakDays} days`}
          className="bg-indigo-400/30 border border-indigo-300/40 rounded-lg px-3 py-1.5 text-center shadow-sm
                     hover:shadow-lg hover:shadow-indigo-500/40 hover:scale-105 transition duration-200 motion-reduce:transition-none motion-reduce:hover:transform-none"
        >
          <span className="text-xs text-indigo-100 block">Streak</span>
          <div className="font-semibold text-white text-sm" aria-hidden="true">
            <span aria-hidden="true">🔥</span> {streakDays}d
          </div>
        </div>

        {/* Notification Bell (button for keyboard & screen reader access) */}
        <div>
          <button
            type="button"
            onClick={onNotificationsClick}
            aria-label={`Open notifications (${notificationsCount} unread)`}
            className="relative cursor-pointer p-1 rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none
                       hover:scale-110 transition-transform motion-reduce:transition-none motion-reduce:hover:transform-none"
            title={`You have ${notificationsCount} unread notifications`}
          >
            <Bell className="w-6 h-6 text-white" aria-hidden="true" />

            {/* Visual badge */}
            <span
              aria-hidden="true"
              className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4
                         flex items-center justify-center rounded-full animate-bounce shadow-md"
            >
              {notificationsCount}
            </span>

            {/* Screen-reader friendly announcement */}
            <span className="sr-only">
              {notificationsCount} unread notification{notificationsCount !== 1 ? "s" : ""}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  userName: PropTypes.string,
  goalsCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  streakDays: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  notificationsCount: PropTypes.number,
  onNotificationsClick: PropTypes.func,
};

Header.defaultProps = {
  userName: "John Doe",
  goalsCount: 5,
  streakDays: 12,
  notificationsCount: 3,
  onNotificationsClick: () => {},
}

export default React.memo(Header);
