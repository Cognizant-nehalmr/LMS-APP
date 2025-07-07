import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as transactionService from "../../api/transactionService.js";

// ✅ Async Thunks
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchAll",
  async () => {
    const res = await transactionService.getTransactions();
    return res.data;
  }
);

export const fetchTransactionById = createAsyncThunk(
  "transactions/fetchById",
  async (id) => {
    const res = await transactionService.getTransactionById(id);
    return res.data;
  }
);

export const fetchOverdueTransactions = createAsyncThunk(
  "transaction/fetchOverdueTransactions",
  async (_, thunkAPI) => {
    try {
      const response = await transactionService.getOverdueTransactions();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createTransaction = createAsyncThunk(
  "transactions/borrowBook",
  async (transactionData, { rejectWithValue }) => {
    try {
      const res = await transactionService.borrowBook(transactionData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const returnTransaction = createAsyncThunk(
  "transactions/returnBook",
  async (id, { rejectWithValue }) => {
    try {
      const res = await transactionService.returnBook(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// 🔁 Slice
const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    transactions: [],
    overdueTransactions: [],
    currentTransaction: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentTransaction: (state) => {
      state.currentTransaction = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch all
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state) => {
        state.loading = false;
      })

      // fetch by id
      .addCase(fetchTransactionById.fulfilled, (state, action) => {
        state.currentTransaction = action.payload;
      })

      // create
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.transactions.push(action.payload);
        state.error = null;
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.error = action.payload;
      })

      // return
      .addCase(returnTransaction.fulfilled, (state, action) => {
        const index = state.transactions.findIndex(
          (t) => t.transactionId === action.payload.transactionId
        );
        if (index !== -1) state.transactions[index] = action.payload;
      })
      .addCase(fetchOverdueTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOverdueTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.overdueTransactions = action.payload;
      })
      .addCase(fetchOverdueTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentTransaction } = transactionSlice.actions;
export default transactionSlice.reducer;
