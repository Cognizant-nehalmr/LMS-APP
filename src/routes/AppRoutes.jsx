// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Dashboard from "../components/Dashboard";
import BookManagement from "../components/BookManagement";
import MemberManagement from "../components/MemberManagement";
import BorrowReturn from "../components/BorrowReturn";
import OverdueFines from "../components/OverdueFines";
import Notifications from "../components/Notifications";

export default function AppRoutes({
  notifications,
  members,
  setNotifications,
}) {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/books" element={<BookManagement />} />
      <Route path="/members" element={<MemberManagement />} />
      <Route path="/borrow" element={<BorrowReturn />} />
      <Route path="/fines" element={<OverdueFines />} />
      <Route
        path="/notifications"
        element={
          <Notifications
            notifications={notifications}
            members={members}
            setNotifications={setNotifications}
          />
        }
      />
    </Routes>
  );
}
