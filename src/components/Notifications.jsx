import React from 'react';

export default function Notifications({ notifications, members }) {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Notifications & Alerts</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Notification Settings */}
                <div className="card lg:col-span-1">
                    <div className="p-5">
                        <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Due Date Reminders</p>
                                    <p className="text-sm text-gray-600">Send reminders 3 days before due date</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Overdue Alerts</p>
                                    <p className="text-sm text-gray-600">Send alerts when books become overdue</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Fine Notifications</p>
                                    <p className="text-sm text-gray-600">Notify members about fines</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>

                            <div className="pt-4">
                                <button className="btn btn-primary w-full">Save Settings</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notification History */}
                <div className="card lg:col-span-2">
                    <div className="p-5">
                        <h2 className="text-xl font-semibold mb-4">Notification History</h2>

                        <div className="space-y-4">
                            {notifications.map(notification => {
                                const member = members.find(m => m.id === notification.memberId);
                                return (
                                    <div key={notification.id} className="border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                                        <div className="flex justify-between">
                                            <span className="font-medium">{member?.name}</span>
                                            <span className="text-sm text-gray-500">{notification.date}</span>
                                        </div>
                                        <p className="mt-1">{notification.message}</p>
                                        <div className="mt-2 flex items-center text-sm text-gray-600">
                                            <i className="fas fa-envelope mr-2"></i>
                                            <span>Sent via Email</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Send Notification */}
            <div className="card">
                <div className="p-5">
                    <h2 className="text-xl font-semibold mb-4">Send New Notification</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Recipient</label>
                            <select className="input-field border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none">
                                <option value="">Select a member</option>
                                {members.map(member => (
                                    <option key={member.id} value={member.id}>
                                        {member.name} ({member.email})
                                    </option>
                                ))}
                                <option value="all">All Members</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Notification Type</label>
                            <select className="input-field border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none">
                                <option value="">Select type</option>
                                <option value="due_reminder">Due Date Reminder</option>
                                <option value="overdue">Overdue Alert</option>
                                <option value="fine">Fine Notification</option>
                                <option value="custom">Custom Message</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Message</label>
                        <textarea
                            className="input-field border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                            rows="4"
                            placeholder="Enter notification message..."
                        ></textarea>
                    </div>

                    <div className="flex justify-end">
                        <button className="btn btn-primary">Send Notification</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
