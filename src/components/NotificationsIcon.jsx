import React from 'react';

export default function NotificationsIcon({ count }) {
    return (
        <div className="relative">
            <i className="fas fa-bell text-xl"></i>
            {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full font-bold w-5 h-5 flex items-center justify-center">
                    {count}
                </span>
            )}
        </div>
    );
}
