import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getBooks, addBook, getBookById, updateBook, deleteBook } from '../../api/bookService';

export const fetchBooks = createAsyncThunk('book/fetchBooks', async () => {
  const res = await getBooks();
  return res.data;
});

export const createBook = createAsyncThunk('book/createBook', async (book) => {
  const res = await addBook(book);
  return res.data;
});

export const editBook = createAsyncThunk('book/editBook', async ({ id, updatedBook }) => {
  const res = await updateBook(id, updatedBook);
  return res.data;
});

export const removeBook = createAsyncThunk('book/removeBook', async (id) => {
  await deleteBook(id);
  return id;
});

const bookSlice = createSlice({
  name: 'book',
  initialState: {
    books: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.books = action.payload;
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.books.push(action.payload);
      })
      .addCase(removeBook.fulfilled, (state, action) => {
        state.books = state.books.filter(book => book.bookId !== action.payload);
      })
      .addCase(editBook.fulfilled, (state, action) => {
        const index = state.books.findIndex(b => b.bookId === action.payload.bookId);
        if (index !== -1) state.books[index] = action.payload;
      });
  }
});

export default bookSlice.reducer;
