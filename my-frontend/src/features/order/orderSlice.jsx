import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { extractApiError } from "../../utils/apiErrorParser";

export const addToOrder = createAsyncThunk(
  "orderitem/post",
  async (data, thunkAPI) => {
    try {
      const response = await api.post("order/", data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        extractApiError(error.response?.data) || "Failed to create order."
      );
    }
  },
);
export const fetchOrder = createAsyncThunk(
  "orderitem/get",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("order/");
      console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        extractApiError(error.response?.data) || "Failed to load orders."
      );
    }
  },
);

export const orderSlice = createSlice({
  name: "orderItems",
  initialState: {
    orderItem: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
      builder
        .addCase(addToOrder.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(addToOrder.fulfilled, (state, action) => {
          state.loading = false;
          state.orderItem=action.payload
        })
        .addCase(addToOrder.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        
        .addCase(fetchOrder.fulfilled, (state, action) => {
          state.loading = false;
          state.orderItem=action.payload
        })
        .addCase(fetchOrder.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
      
    },
  });
  
  export default orderSlice.reducer;
  