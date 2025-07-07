import React from 'react';

export default function NavItem({ icon, label, active, onClick }) {
    return (
        <li>
            <button
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors hover:bg-white/10 ${active ? 'bg-primary/80' : ''}`}
                onClick={onClick}
            >
                <i className={`${icon} mr-3`}></i>
                <span>{label}</span>
            </button>
        </li>
    );
}
