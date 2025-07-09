// NavItem.jsx
import { NavLink } from "react-router-dom";

export default function NavItem({ to, icon, label }) {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `w-full flex items-center px-4 py-3 rounded-lg transition-colors hover:bg-white/10 ${
            isActive ? "bg-primary/80 text-white" : "text-white"
          }`
        }
      >
        <i className={`${icon} mr-3`}></i>
        <span>{label}</span>
      </NavLink>
    </li>
  );
}
