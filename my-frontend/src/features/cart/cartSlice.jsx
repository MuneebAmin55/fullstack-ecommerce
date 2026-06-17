import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const addToCart = createAsyncThunk(
  "cartitem/post",
  async (data, thunkAPI) => {
    try {
      const response = await api.post("cartitems/", data);
      return response.data;
    } catch {
      return thunkAPI.rejectWithValue("Failed to add pro to cart");
    }
  },
);

export const deleteCartItem = createAsyncThunk(
  "cartitem/delete",
  async (id, thunkAPI) => {
    try {
      await api.delete(`cartitems/${id}/`);
      return id; // return the ID we deleted
    } catch {
      return thunkAPI.rejectWithValue("Failed to delete cart item");
    }
  },
);
export const updateQty = createAsyncThunk(
  "quantity/update",
  async ({ id, quantity }, thunkAPI) => {
    try {
      const response = await api.patch(`cartitems/${id}/`, { quantity });
      return response.data;
    } catch {
      return thunkAPI.rejectWithValue("Failed to  patch itemquanoti");
    }
  },
);

export const cartItemAll = createAsyncThunk(
  "cartitem/getId",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("cartitems");
      return response.data;
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch cartitm");
    }
  },
);

export const cartSlice = createSlice({
  name: "cartItems",
  initialState: {
    cartItem: [],
    loading: false,
    error: null,
    selectedItems: [],
  },
  reducers: {
    setSelectedItems: (state, action) => {
      state.selectedItems = action.payload;
    },

    clearSelectedItems: (state) => {
      state.selectedItems = [];
    }
  },
  extraReducers: (builder) => {
    builder

      .addCase(cartItemAll.pending, (state) => {
        state.loading = true;
      })

      .addCase(cartItemAll.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItem = action.payload;
      })

      .addCase(cartItemAll.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch cartitem";
      })

      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItem.push({
          ...action.payload,
          quantity: action.payload.quantity ?? 1,
        });
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.cartItem = state.cartItem.filter(
          (item) => item.id !== action.payload,
        );
      })
      .addCase(updateQty.fulfilled, (state, action) => {
        state.loading = false;

        const updatedItem = action.payload;

        const index = state.cartItem.findIndex(
          (item) => item.id === updatedItem.id,
        );

        if (index !== -1) {
          state.cartItem[index] = updatedItem;
        }
      });
  },
});



export const { setSelectedItems, clearSelectedItems } = cartSlice.actions;
export default cartSlice.reducer;
