// Create API modules for each backend service
// Example structure for BookService API

// bookService.js
import axios from 'axios';

// Update baseURL to route through API Gateway
const bookServiceApi = axios.create({
  baseURL: 'http://localhost:8080/api/books',
});

export const getBooks = () => bookServiceApi.get('');
export const getBookById = (bookId) => bookServiceApi.get(`/${bookId}`);
export const addBook = (bookData) => {
  return bookServiceApi.post('', { ...bookData }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
export const updateBook = (bookId, bookData) => bookServiceApi.put(`/${bookId}`, bookData);
export const deleteBook = (bookId) => bookServiceApi.delete(`/${bookId}`);

export default bookServiceApi;

// Repeat similar structure for other services like MemberService, FineService, etc.