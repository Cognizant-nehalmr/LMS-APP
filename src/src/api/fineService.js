// fineService.js
import axios from 'axios';

// Update baseURL to route through API Gateway
const fineServiceApi = axios.create({
  baseURL: 'http://localhost:8080/api/fines',
});

export const getFines = () => fineServiceApi.get('');
export const getFineById = (fineId) => fineServiceApi.get(`/${fineId}`);
export const addFine = (fineData) => fineServiceApi.post('/', fineData);
export const updateFine = (fineId, fineData) => fineServiceApi.put(`/${fineId}`, fineData);
export const deleteFine = (fineId) => fineServiceApi.delete(`/${fineId}`);

export default fineServiceApi;