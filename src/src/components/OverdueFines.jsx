import React, { useState } from 'react';

export default function OverdueFines({ fines, members, setFines }) {
    const [showAddFineModal, setShowAddFineModal] = useState(false);
    const [newFine, setNewFine] = useState({
        memberId: '',
        amount: '',
        status: 'Pending',
        date: new Date().toISOString().split('T')[0]
    });

    const handleAddFine = () => {
        if (newFine.memberId && newFine.amount) {
            const fine = {
                id: fines.length + 1,
                memberId: parseInt(newFine.memberId),
                amount: parseFloat(newFine.amount),
                status: 'Pending',
                date: new Date().toISOString().split('T')[0]
            };
            setFines([...fines, fine]);
            setShowAddFineModal(false);
            setNewFine({
                memberId: '',
                amount: '',
                status: 'Pending',
                date: new Date().toISOString().split('T')[0]
            });
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Overdue Books & Fines</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Overdue Books */}
                <div className="card">
                    <div className="p-5">
                        <h2 className="text-xl font-semibold mb-4">Overdue Books</h2>
                        <div className="space-y-4">
                            {Array(3).fill().map((_, index) => (
                                <div key={index} className="border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                                    <div className="flex justify-between">
                                        <span className="font-medium">The Great Gatsby</span>
                                        <span className="text-red-500 font-medium">5 days overdue</span>
                                    </div>
                                    <p className="text-sm text-gray-600">Borrowed by: John Doe</p>
                                    <p className="text-sm text-gray-600">Due: 2023-06-15</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Fines Summary */}
                <div className="card">
                    <div className="p-5">
                        <h2 className="text-xl font-semibold mb-4">Fines Summary</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium">Total Outstanding Fines</p>
                                    <p className="text-sm text-gray-600">Unpaid fines across all members</p>
                                </div>
                                <span className="text-2xl font-bold text-red-500">$15.00</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium">Total Collected Fines</p>
                                    <p className="text-sm text-gray-600">Paid fines this month</p>
                                </div>
                                <span className="text-2xl font-bold text-green-500">$25.00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fines List */}
            <div className="card">
                <div className="p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Fines Management</h2>
                        <button className="btn btn-primary" onClick={() => setShowAddFineModal(true)}>
                            <i className="fas fa-plus mr-2"></i> Add Fine
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-3 px-4 text-left">Member</th>
                                    <th className="py-3 px-4 text-left">Amount</th>
                                    <th className="py-3 px-4 text-left">Status</th>
                                    <th className="py-3 px-4 text-left">Date</th>
                                    <th className="py-3 px-4 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fines.map(fine => {
                                    const member = members.find(m => m.id === fine.memberId);
                                    return (
                                        <tr key={fine.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="py-3 px-4">{member?.name}</td>
                                            <td className="py-3 px-4">${fine.amount.toFixed(2)}</td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 rounded-full text-xs ${fine.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                                    {fine.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">{fine.date}</td>
                                            <td className="py-3 px-4">
                                                {fine.status === 'Pending' && (
                                                    <button className="btn btn-secondary px-3 py-1 text-sm">
                                                        Mark as Paid
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add Fine Modal */}
            {showAddFineModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
                    <div className="bg-white rounded-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Add New Fine</h2>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => setShowAddFineModal(false)}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Member *</label>
                                <select
                                    className="input-field border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                                    value={newFine.memberId}
                                    onChange={(e) => setNewFine({ ...newFine, memberId: e.target.value })}
                                >
                                    <option value="">Select a member</option>
                                    {members.map(member => (
                                        <option key={member.id} value={member.id}>{member.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Amount *</label>
                                <input
                                    type="number"
                                    className="input-field border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                                    value={newFine.amount}
                                    onChange={(e) => setNewFine({ ...newFine, amount: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    className="btn bg-gray-200 hover:bg-gray-300"
                                    onClick={() => setShowAddFineModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleAddFine}
                                >
                                    Add Fine
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
