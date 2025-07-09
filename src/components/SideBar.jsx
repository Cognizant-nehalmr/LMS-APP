// src/components/Sidebar.jsx
import React from "react";
import NavItem from "./NavItem";

export default function Sidebar({ isSidebarOpen }) {
  return (
    <aside
      className={`bg-dark text-white w-64 fixed md:relative h-full md:h-auto z-10 transform md:transform-none transition-transform duration-300 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-6">Navigation</h2>
        <nav>
          <ul className="space-y-2">
            <NavItem to="/dashboard" icon="fas fa-home" label="Dashboard" />
            <NavItem to="/books" icon="fas fa-book" label="Book Management" />
            <NavItem
              to="/members"
              icon="fas fa-users"
              label="Member Management"
            />
            <NavItem
              to="/borrow"
              icon="fas fa-exchange-alt"
              label="Borrow/Return"
            />
            <NavItem
              to="/fines"
              icon="fas fa-money-bill-wave"
              label="Overdue & Fines"
            />
            <NavItem
              to="/notifications"
              icon="fas fa-bell"
              label="Notifications"
            />
          </ul>
        </nav>
      </div>
    </aside>
  );
}