// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";
import Sidebar from "./components/SideBar";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [members, setMembers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Active" },
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      memberId: 1,
      message: 'Book "The Great Gatsby" is due in 2 days',
      date: "2023-06-13",
    },
    {
      id: 2,
      memberId: 1,
      message: "You have an overdue book",
      date: "2023-06-16",
    },
  ]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header notifications={notifications} toggleSidebar={toggleSidebar} />

        <div className="flex flex-1">
          <Sidebar isSidebarOpen={isSidebarOpen} />
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <div className="container mx-auto">
              <AppRoutes
                notifications={notifications}
                members={members}
                setNotifications={setNotifications}
              />
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </Router>
  );
}