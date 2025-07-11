import React, { useEffect, useState } from "react";
import {
  getAllNotifications,
  sendCustomEmail,
  triggerFineNotifications,
  triggerOverdueNotifications,
} from "../api/notificationService";
import { useSelector } from "react-redux";

export default function Notifications() {
  const members = useSelector((state) => state.member.members);
  const [notifications, setNotifications] = useState([]);
  const [form, setForm] = useState({
    memberId: "",
    subject: "",
    message: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [triggerMessage, setTriggerMessage] = useState("");
  const [triggerError, setTriggerError] = useState("");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const res = await getAllNotifications();
    setNotifications(res.data);
  };

  const handleSendCustomEmail = async () => {
    const { memberId, subject, message } = form;

    // Clear any previous messages
    setSuccessMessage("");
    setErrorMessage("");

    // === Validation ===
    if (!memberId || !subject.trim() || !message.trim()) {
      setErrorMessage("Please fill all the required fields.");
      return;
    }

    const selectedMember = members.find((m) => m.memberId === Number(memberId));

    if (!selectedMember) {
      setErrorMessage("Invalid member selected.");
      return;
    }

    try {
      await sendCustomEmail({
        memberId: selectedMember.memberId,
        memberName: selectedMember.name,
        memberEmail: selectedMember.email,
        subject: subject.trim(),
        message: message.trim(),
      });

      setSuccessMessage("Email sent successfully!");
      setForm({ memberId: "", subject: "", message: "" });
      fetchNotifications();
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to send email. Please try again.");
    }

    // Auto-clear messages
    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 3000);
  };

  const handleTriggerOverdue = async () => {
    try {
      const res = await triggerOverdueNotifications();
      setTriggerMessage(res.data); // e.g., "Overdue notifications processing triggered."
      setTriggerError("");
    } catch (error) {
      setTriggerError("Failed to trigger overdue notifications.");
      setTriggerMessage("");
    }

    setTimeout(() => {
      setTriggerMessage("");
      setTriggerError("");
    }, 3000);
  };

  const handleTriggerFines = async () => {
    try {
      const res = await triggerFineNotifications();
      setTriggerMessage(res.data); // e.g., "Fine notifications processing triggered."
      setTriggerError("");
    } catch (error) {
      setTriggerError("Failed to trigger fine notifications.");
      setTriggerMessage("");
    }

    setTimeout(() => {
      setTriggerMessage("");
      setTriggerError("");
    }, 3000);
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Notifications & Alerts</h1>

      {/* Top Section: Triggers + Custom Email */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Notification Triggers */}
        <div className="card bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6 border-b pb-2">
            Notification Triggers
            {triggerMessage && (
              <div className="text-green-600 font-medium mt-4">
                {triggerMessage}
              </div>
            )}
            {triggerError && (
              <div className="text-red-600 font-medium mt-4">
                {triggerError}
              </div>
            )}
          </h2>

          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <i className="fas fa-calendar-alt text-blue-600 mt-1"></i>
              <div className="max-w-[80%]">
                <p className="font-medium text-gray-800">Due Date Reminders</p>
                <p className="text-sm text-gray-600">
                  Send reminders 3 days before due date, Automate notifications
                  to remind members about due books and fines.
                </p>
              </div>
              <button
                className="btn btn-primary px-6 py-2 text-sm"
                onClick={handleTriggerOverdue}
              >
                Send
              </button>
            </div>

            <div className="flex items-center justify-between">
              <i className="fas fa-calendar-alt text-blue-600 mt-1"></i>
              <div className="max-w-[80%]">
                <p className="font-medium text-gray-800">Fine Notifications</p>
                <p className="text-sm text-gray-600">
                  Notify members about fines, Automate notifications to inform
                  members about pending fines and dues.
                </p>
              </div>
              <button
                className="btn btn-primary px-6 py-2 text-sm"
                onClick={handleTriggerFines}
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Send Custom Email */}
        <div className="card bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Send Custom Email
          </h2>

          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Recipient
              </label>
              <select
                value={form.memberId}
                onChange={(e) => setForm({ ...form, memberId: e.target.value })}
                className="input-field border-gray-300 w-full"
              >
                <option value="">Select a member</option>
                {members.map((member) => (
                  <option key={member.memberId} value={member.memberId}>
                    {member.name} ({member.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="input-field border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-2 w-full caret-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                rows="4"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="input-field border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-2 w-full caret-black"
              ></textarea>
            </div>
          </div>
          <div className="flex justify-end">
            {successMessage && (
              <div className="text-green-600 font-medium mb-4">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="text-red-600 font-medium mb-4">
                {errorMessage}
              </div>
            )}
            <button className="btn btn-primary" onClick={handleSendCustomEmail}>
              Send Notification
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Notification History */}
      <div className="card bg-white rounded-lg shadow p-5">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          Recent Notifications
        </h2>

        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {notifications.slice(0, 3).map((notification) => {
            const member = members.find(
              (m) => m.memberId === notification.memberId
            );
            return (
              <div
                key={notification.notificationId}
                className="border-b border-gray-200 pb-3 last:border-0 last:pb-0"
              >
                <div className="flex justify-between">
                  <span className="font-medium">{member?.name}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(
                      notification.dateSent || notification.createdAt
                    ).toLocaleString()}
                  </span>
                </div>
                <p className="mt-1">{notification.message}</p>
                <div className="mt-2 flex items-center text-sm text-gray-600">
                  <i className="fas fa-envelope mr-2"></i>
                  <span>Sent via Email to {notification.recipientEmail}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
