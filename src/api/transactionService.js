// transactionService.js
import axios from 'axios';

// Base URL pointing to your API Gateway or directly to the service
const transactionServiceApi = axios.create({
  baseURL: 'http://localhost:8080/api/transactions',
});

// ✅ 1. Get all transactions
export const getTransactions = () => transactionServiceApi.get('');

// ✅ 2. Get transaction by ID
export const getTransactionById = (transactionId) =>
  transactionServiceApi.get(`/${transactionId}`);

// ✅ 3. Get transactions by Member ID
export const getTransactionsByMemberId = (memberId) =>
  transactionServiceApi.get(`/member/${memberId}`);

// ✅ 4. Get transactions by Book ID
export const getTransactionsByBookId = (bookId) =>
  transactionServiceApi.get(`/book/${bookId}`);

// ✅ 5. Get all overdue transactions
export const getOverdueTransactions = () =>
  transactionServiceApi.get('/overdue');

// ✅ 6. Borrow a new book (POST)
export const borrowBook = (transactionData) =>
  transactionServiceApi.post('/borrow', transactionData);

// ✅ 7. Return a book by transaction ID (PUT)
export const returnBook = (transactionId) =>
  transactionServiceApi.put(`/${transactionId}/return`);

// ✅ 8. Manually trigger overdue update (POST)
export const updateOverdueTransactions = () =>
  transactionServiceApi.post('/update-overdue');

export default transactionServiceApi;