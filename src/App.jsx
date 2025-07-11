// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";
import Sidebar from "./components/SideBar";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header toggleSidebar={toggleSidebar}/>

        <div className="flex flex-1">
          <Sidebar isSidebarOpen={isSidebarOpen} />
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <div className="container mx-auto">
              <AppRoutes />
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </Router>
  );
}
