import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as fineService from "../../api/fineService.js";

// 🔁 Thunks

export const fetchTotalCollectedFines = createAsyncThunk(
  "fines/fetchTotalCollectedFines",
  async (_, thunkAPI) => {
    try {
      return await fineService.getTotalCollectedFines();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Server Error");
    }
  }
);

export const fetchFines = createAsyncThunk("fines/fetchFines", async () => {
  const response = await fineService.getFines();
  return response.data;
});

export const getFineById = createAsyncThunk(
  "fines/getFineById",
  async (fineId) => {
    const response = await fineService.getFineById(fineId);
    return response.data;
  }
);

export const getFinesByMemberId = createAsyncThunk(
  "fines/getFinesByMemberId",
  async (memberId) => {
    const response = await fineService.getFinesByMemberId(memberId);
    return response.data;
  }
);

export const getPendingFines = createAsyncThunk(
  "fines/getPendingFines",
  async () => {
    const response = await fineService.getPendingFines();
    return response.data;
  }
);

export const getTotalPendingFinesByMember = createAsyncThunk(
  "fines/getTotalPendingFinesByMember",
  async (memberId) => {
    const response = await fineService.getTotalPendingFinesByMember(memberId);
    return response.data;
  }
);

export const createFine = createAsyncThunk(
  "fines/createFine",
  async ({ transactionId, fineType, amount }) => {
    const response = await fineService.createFine(
      transactionId,
      fineType,
      amount
    ); // ✅ make sure amount is passed here
    return response.data;
  }
);

export const payFine = createAsyncThunk("fines/payFine", async (fineId) => {
  const response = await fineService.payFine(fineId);
  return response.data;
});

export const cancelFine = createAsyncThunk(
  "fines/cancelFine",
  async (fineId) => {
    const response = await fineService.cancelFine(fineId);
    return response.data;
  }
);

export const reverseFine = createAsyncThunk(
  "fines/reverseFine",
  async (fineId) => {
    const response = await fineService.reverseFine(fineId);
    return response.data;
  }
);

// ✅ Modified updateFines to fetch latest data
export const updateFines = createAsyncThunk(
  "fines/updateFines",
  async (_, { dispatch }) => {
    const response = await fineService.updateFines();
    await dispatch(fetchFines()); // refetch updated fines
    return response.data;
  }
);

export const deleteFine = createAsyncThunk(
  "fines/deleteFine",
  async (fineId) => {
    await fineService.deleteFine(fineId);
    return fineId;
  }
);

// 🧠 Slice
const fineSlice = createSlice({
  name: "fines",
  initialState: {
    fines: [],
    pendingFines: 0,
    collectedFines: 0,
    loading: false,
    error: null,
    totalPendingByMember: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFines.fulfilled, (state, action) => {
        state.loading = false;
        state.fines = action.payload;
      })
      .addCase(fetchFines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.error("Error fetching fines:", action.error.message);
      })

      .addCase(createFine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFine.fulfilled, (state, action) => {
        state.loading = false;
        state.fines.push(action.payload);
      })
      .addCase(createFine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.error("Error creating fine:", action.error.message);
      })

      .addCase(payFine.fulfilled, (state, action) => {
        const updatedFine = action.payload;
        const index = state.fines.findIndex(
          (fine) => fine.fineDTO.fineId === updatedFine.fineDTO.fineId
        );
        if (index !== -1) state.fines[index] = updatedFine;
      })

      .addCase(cancelFine.fulfilled, (state, action) => {
        const index = state.fines.findIndex(
          (fine) => fine.fineDTO.fineId === action.payload.fineDTO.fineId
        );
        if (index !== -1) state.fines[index] = action.payload;
      })

      .addCase(reverseFine.fulfilled, (state, action) => {
        const index = state.fines.findIndex(
          (fine) => fine.fineDTO.fineId === action.payload.fineDTO.fineId
        );
        if (index !== -1) state.fines[index] = action.payload;
      })

      .addCase(updateFines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFines.fulfilled, (state) => {
        state.loading = false;
        // ✅ Don't set `fines = action.payload` here, as `fetchFines` has already done that
      })
      .addCase(updateFines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.error("Error updating fines:", action.error.message);
      })

      .addCase(deleteFine.fulfilled, (state, action) => {
        state.fines = state.fines.filter(
          (fine) => fine.fineDTO.fineId !== action.payload
        );
      })

      .addCase(getFineById.fulfilled, (state, action) => {
        const index = state.fines.findIndex(
          (fine) => fine.fineDTO.fineId === action.payload.fineDTO.fineId
        );
        if (index !== -1) state.fines[index] = action.payload;
        else state.fines.push(action.payload);
      })

      .addCase(getFinesByMemberId.fulfilled, (state, action) => {
        state.fines = action.payload;
      })

      .addCase(getPendingFines.fulfilled, (state, action) => {
        state.pendingFines = action.payload; // ✅ Correctly store pending amount
      })

      .addCase(getTotalPendingFinesByMember.fulfilled, (state, action) => {
        state.totalPendingByMember = action.payload;
      })
      .addCase(fetchTotalCollectedFines.fulfilled, (state, action) => {
        state.collectedFines = action.payload;
      });
  },
});

export default fineSlice.reducer;
