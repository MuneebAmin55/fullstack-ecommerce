import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

/* ================= CREATE ADDRESS ================= */

export const createAddress = createAsyncThunk(
  "checkout/address",
  async (addressData, thunkAPI) => {
    try {
      const response = await api.post("address/", addressData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

/* ================= FETCH ADDRESS ================= */

export const fetchAddress = createAsyncThunk(
  "fetch/address",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("address/");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

/* ================= UPDATE ADDRESS ================= */

export const updateAddress = createAsyncThunk(
  "address/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await api.put(`address/${id}/`, data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

/* ================= DELETE ADDRESS (Optional) ================= */

export const deleteAddress = createAsyncThunk(
  "address/delete",
  async (id, thunkAPI) => {
    try {
      await api.delete(`address/${id}/`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const addressSlice = createSlice({
  name: "address",

  initialState: {
    isaddress: false,
    address: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // CREATE
      .addCase(createAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.isaddress = true;
        state.address.push(action.payload);
      })

      .addCase(createAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH
      .addCase(fetchAddress.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.address = action.payload;
      })

      .addCase(fetchAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
      })

      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.address.findIndex(
          (item) => item.id === action.payload.id
        );

        if (index !== -1) {
          state.address[index] = action.payload;
        }
      })

      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.address = state.address.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export default addressSlice.reducer;