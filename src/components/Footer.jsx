import React from "react";

export default function Footer() {
  return (
        <footer className="bg-gray-800 text-white py-4">
          <div className="container mx-auto px-4 text-center">
            <p>
              Library Management System &copy; {new Date().getFullYear()} - All
              Rights Reserved
            </p>
          </div>
        </footer>
      
  );
}