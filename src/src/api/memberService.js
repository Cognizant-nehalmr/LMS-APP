// memberService.js
import axios from "axios";

// Update baseURL to route through API Gateway
const memberServiceApi = axios.create({
  baseURL: "http://localhost:8080/api/members",
});

export const getMembers = () => memberServiceApi.get("");

export const getMemberById = (memberId) => memberServiceApi.get(`/${memberId}`);

export const addMember = (memberData) => memberServiceApi.post("", memberData);

export const updateMember = (memberId, memberData) =>
  memberServiceApi.put(`/${memberId}`, memberData);

export const deleteMember = (memberId) =>
  memberServiceApi.delete(`/${memberId}`);

export const updateMemberStatus = (memberId, status) =>
  memberServiceApi.put(`/${memberId}/${status}`);

export default memberServiceApi;
