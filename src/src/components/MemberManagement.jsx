import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMembers,
  createMember,
  removeMember,
  editMember,
  changeMemberStatus,
} from "../features/members/memberSlice.js";

export default function MemberManagement() {
  const dispatch = useDispatch();
  const members = useSelector((state) => state.member.members);

  const [showAddModal, setShowAddModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    status: "Active",
  });
  const [editMemberId, setEditMemberId] = useState(null);

  useEffect(() => {
    dispatch(fetchMembers());
  }, [dispatch]);

  const handleAddMember = () => {
    const { name, email, phone } = newMember;

    // Basic Validations
    if (!name.trim()) {
      setErrorMessage("Name is required.");
      return;
    }
    if (!email.trim()) {
      setErrorMessage("Email is required.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (phone && !/^\d{10}$/.test(phone)) {
      setErrorMessage("Phone number must be exactly 10 digits.");
      return;
    }

    // If all validations pass
    const memberToAdd = {
      ...newMember,
      status: "ACTIVE", // backend expects status
    };

    dispatch(createMember(memberToAdd));
    setShowAddModal(false);
    setNewMember({
      name: "",
      email: "",
      phone: "",
      address: "",
      status: "ACTIVE",
    });
    setErrorMessage(""); // Clear previous error
  };

  const handleEditClick = (member) => {
    setEditMemberId(member.memberId); // or member.id
    setNewMember({
      name: member.name,
      email: member.email,
      phone: member.phone,
      address: member.address,
      status: member.membershipStatus,
    });
    setShowAddModal(true);
  };

  const handleUpdateMember = () => {
    const { name, email, phone } = newMember;

    // Validations
    if (!name.trim()) {
      setErrorMessage("Name is required.");
      return;
    }

    if (!email.trim()) {
      setErrorMessage("Email is required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (phone && !/^\d{10}$/.test(phone)) {
      setErrorMessage("Phone number must be exactly 10 digits.");
      return;
    }

    // Dispatch update
    dispatch(editMember({ id: editMemberId, updatedMember: newMember }));

    // Reset form
    setShowAddModal(false);
    setEditMemberId(null);
    setNewMember({
      name: "",
      email: "",
      phone: "",
      address: "",
      status: "ACTIVE",
    });
    setErrorMessage(""); // clear error
  };

  const toggleStatus = (member) => {
    const newStatus =
      member.membershipStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    dispatch(changeMemberStatus({ id: member.memberId, status: newStatus }));
  };

  const handleDeleteMember = (id) => {
    dispatch(removeMember(id));
  };

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
                      className={`px-2 py-1 rounded-full text-xs font-medium transition duration-200 ${
                        member.membershipStatus === "ACTIVE"
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                      }`}
                    >
                      {member.membershipStatus === "ACTIVE"
                        ? "ACTIVE"
                        : "INACTIVE"}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      className="text-blue-500 hover:text-blue-700 mr-3"
                      onClick={() => handleEditClick(member)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteMember(member.memberId)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                  <td className="py-3 px-4">{member.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Member</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setNewMember({
                    name: "",
                    email: "",
                    phone: "",
                    address: "",
                    status: "ACTIVE",
                  });
                  setShowAddModal(false);
                  setErrorMessage(""); // Clear error on close
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
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  className="input-field border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                  value={newMember.name}
                  onChange={(e) => {
                    setNewMember({ ...newMember, name: e.target.value });
                    setErrorMessage(""); // Clear error on input change
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  className="input-field border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                  value={newMember.email}
                  onChange={(e) => {
                    setNewMember({ ...newMember, email: e.target.value });
                    setErrorMessage(""); // Clear error on input change
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  className="input-field border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                  value={newMember.phone}
                  onChange={(e) => {
                    setNewMember({ ...newMember, phone: e.target.value });
                    setErrorMessage(""); // Clear error on input change
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Address
                </label>
                <textarea
                  className="input-field border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                  value={newMember.address}
                  onChange={(e) =>
                    setNewMember({ ...newMember, address: e.target.value })
                  }
                  rows="3"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  className="btn bg-gray-200 hover:bg-gray-300"
                  onClick={() => {
                    setNewMember({
                      name: "",
                      email: "",
                      phone: "",
                      address: "",
                      status: "ACTIVE",
                    });
                    setShowAddModal(false);
                    setErrorMessage(""); // Clear error on close
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
