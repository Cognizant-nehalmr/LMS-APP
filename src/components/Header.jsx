// components/Header.jsx
import React from "react";

export default function Header({ toggleSidebar }) {
  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <i className="fas fa-book text-2xl mr-3"></i>
          <h1 className="text-xl font-bold">Library Management System</h1>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center">
            <img
              src="https://ui-avatars.com/api/?name=Librarian&background=random"
              alt="Admin"
              className="w-8 h-8 rounded-full"
            />
            <span className="ml-2">Librarian</span>
          </div>
        </div>
        <button className="md:hidden text-white" onClick={toggleSidebar}>
          <i className="fas fa-bars text-xl"></i>
        </button>
      </div>
    </header>
  );
}
