import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getMembers,
  addMember,
  getMemberById,
  updateMember,
  deleteMember,
  updateMemberStatus,
} from "../../api/memberService.js";

export const fetchMembers = createAsyncThunk(
  "member/fetchMembers",
  async () => {
    const res = await getMembers();
    return res.data;
  }
);

export const createMember = createAsyncThunk(
  "member/createMember",
  async (member) => {
    const res = await addMember(member);
    return res.data;
  }
);

export const editMember = createAsyncThunk(
  "member/editMember",
  async ({ id, updatedMember }) => {
    const res = await updateMember(id, updatedMember);
    return res.data;
  }
);

export const removeMember = createAsyncThunk(
  "member/removeMember",
  async (id) => {
    await deleteMember(id);
    return id;
  }
);

export const changeMemberStatus = createAsyncThunk(
  "member/changeMemberStatus",
  async ({ id, status }) => {
    const response = await updateMemberStatus(id, status);
    return response.data;
  }
);

// Slice
const memberSlice = createSlice({
  name: "member",
  initialState: {
    members: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload;
      })
      .addCase(createMember.fulfilled, (state, action) => {
        state.members.push(action.payload);
      })
      .addCase(editMember.fulfilled, (state, action) => {
        const index = state.members.findIndex(
          (m) => m.memberId === action.payload.memberId
        );
        if (index !== -1) state.members[index] = action.payload;
      })
      .addCase(removeMember.fulfilled, (state, action) => {
        state.members = state.members.filter(
          (m) => m.memberId !== action.payload
        );
      })
      .addCase(changeMemberStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.members.findIndex(
          (m) => m.memberId === updated.memberId
        );
        if (index !== -1) {
          state.members[index] = updated;
        }
      });
  },
});

export default memberSlice.reducer;
