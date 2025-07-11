import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMembers,
  createMember,
  editMember,
  changeMemberStatus,
} from "../features/members/memberSlice.js";

export default function MemberManagement() {
  const dispatch = useDispatch();
  const members = useSelector((state) => state.member.members);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [editMemberId, setEditMemberId] = useState(null);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    dispatch(fetchMembers()).finally(() => setLoading(false));
  }, [dispatch]);

  const resetForm = () => {
    setEditMemberId(null);
    setErrorMessage("");
    setNewMember({
      name: "",
      email: "",
      phone: "",
      address: "",
      status: "ACTIVE",
    });
  };

  const handleAddMember = () => {
    const { name, email, phone } = newMember;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) return setErrorMessage("Name is required.");
    if (!email.trim()) return setErrorMessage("Email is required.");
    if (!emailRegex.test(email))
      return setErrorMessage("Invalid email format.");
    if (phone && !/^\d{10}$/.test(phone))
      return setErrorMessage("Phone number must be 10 digits.");

    dispatch(createMember({ ...newMember, status: "ACTIVE" }));
    setShowAddModal(false);
    resetForm();
  };

  const handleUpdateMember = () => {
    const { name, email, phone } = newMember;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) return setErrorMessage("Name is required.");
    if (!email.trim()) return setErrorMessage("Email is required.");
    if (!emailRegex.test(email))
      return setErrorMessage("Invalid email format.");
    if (phone && !/^\d{10}$/.test(phone))
      return setErrorMessage("Phone number must be 10 digits.");

    dispatch(editMember({ id: editMemberId, updatedMember: newMember }));
    setShowAddModal(false);
    resetForm();
  };

  const handleEditClick = (member) => {
    setEditMemberId(member.memberId);
    setNewMember({
      name: member.name,
      email: member.email,
      phone: member.phone,
      address: member.address,
      status: member.membershipStatus,
    });
    setShowAddModal(true);
  };

  const toggleStatus = (member) => {
    const newStatus =
      member.membershipStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    dispatch(changeMemberStatus({ id: member.memberId, status: newStatus }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-600">
        <i className="fas fa-spinner fa-spin text-3xl text-blue-600 mb-3"></i>
        <p>Loading members...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Member Management</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          <i className="fas fa-plus mr-2"></i> Add Member
        </button>
      </div>

      {/* Members Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
                <th className="py-3 px-4 text-left">Address</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">{member.name}</td>
                  <td className="py-3 px-4">{member.email}</td>
                  <td className="py-3 px-4">{member.phone}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleStatus(member)}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        member.membershipStatus === "ACTIVE"
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                      }`}
                    >
                      {member.membershipStatus}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      className="text-blue-500 hover:text-blue-700 mr-3"
                      onClick={() => handleEditClick(member)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                  </td>
                  <td className="py-3 px-4">{member.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editMemberId ? "Edit Member" : "Add New Member"}
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {errorMessage && (
              <div className="text-red-500 text-sm font-medium mb-3">
                {errorMessage}
              </div>
            )}

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  className="input-field border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-2 w-full caret-black"
                  value={newMember.name}
                  onChange={(e) =>
                    setNewMember({ ...newMember, name: e.target.value })
                  }
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  className="input-field border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-2 w-full caret-black"
                  value={newMember.email}
                  onChange={(e) =>
                    setNewMember({ ...newMember, email: e.target.value })
                  }
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  className="input-field border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-2 w-full caret-black"
                  value={newMember.phone}
                  onChange={(e) =>
                    setNewMember({ ...newMember, phone: e.target.value })
                  }
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Address
                </label>
                <textarea
                  rows="3"
                  className="input-field border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-2 w-full caret-black"
                  value={newMember.address}
                  onChange={(e) =>
                    setNewMember({ ...newMember, address: e.target.value })
                  }
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  className="btn bg-gray-200 hover:bg-gray-300"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={editMemberId ? handleUpdateMember : handleAddMember}
                >
                  {editMemberId ? "Update Member" : "Add Member"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
