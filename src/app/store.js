import { configureStore } from '@reduxjs/toolkit';
import bookReducer from '../features/books/bookSlice.js';
import memberReducer from '../features/members/memberSlice.js';
import transactionReducer from '../features/transactions/transactionSlice';
import fineReducer from '../features/fines/fineSlice.js';

export const store = configureStore({
  reducer: {
    book: bookReducer,
    member: memberReducer,
    transaction: transactionReducer,
    fines: fineReducer,
  }
});
