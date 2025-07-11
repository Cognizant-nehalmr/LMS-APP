import axios from "axios";

// Update baseURL to route through API Gateway
const notificationServiceApi = axios.create({
  baseURL: "http://localhost:8080/api/notifications",
});

// Get all notifications
export const getAllNotifications = () => notificationServiceApi.get("");

// Get notification by ID
export const getNotificationById = (id) => notificationServiceApi.get(`/${id}`);

// Get notifications by member ID
export const getNotificationsByMemberId = (memberId) =>
  notificationServiceApi.get(`/member/${memberId}`);

// Get notifications by status
export const getNotificationsByStatus = (status) =>
  notificationServiceApi.get(`/status/${status}`);

// Send custom email
export const sendCustomEmail = ({
  memberId,
  memberName,
  memberEmail,
  subject,
  message,
}) => {
  const params = new URLSearchParams();
  params.append("memberId", memberId);
  params.append("memberName", memberName);
  params.append("memberEmail", memberEmail);
  params.append("subject", subject);
  params.append("message", message);

  return notificationServiceApi.post(`/custom`, params);
};

// Trigger pending fine notifications
export const triggerFineNotifications = () =>
  notificationServiceApi.post("/fines/process");

// Trigger upcoming overdue alerts
export const triggerOverdueNotifications = () =>
  notificationServiceApi.post("/overdue/process");

// Get notification statistics
export const getNotificationStats = () => notificationServiceApi.get("/stats");

export default notificationServiceApi;
