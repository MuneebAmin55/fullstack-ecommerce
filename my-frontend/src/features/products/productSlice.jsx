import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";


export const fetchProduct = createAsyncThunk(
  "products/fetchAll",
  async (params = {}, thunkAPI) => {
    try {
      const response = await api.get("products/",{params});
      return response.data;
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch products");
    }
  }
);

export const fetchCatagoryImage = createAsyncThunk(
  "CatagoryImage/fetchAll",
  async (params = {}, thunkAPI) => {
    try {
      const response = await api.get("Catagoryimage/",{params});
      return response.data;
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch CatagoryImage");
    }
  }
);


export const fetchProductById = createAsyncThunk(
  "products/fetchId",
  async (_id, thunkAPI) => {
    try {
      const response = await api.get(`products/${_id}/`);
      return response.data;
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch products");
    }
  }
);
export const fetchCategories= createAsyncThunk(
  "catagory/fetchAllCatagories",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("products/");
      return response.data;
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch catagories");
    }
  }
);
const productSlice = createSlice({
  name: "Products",
  initialState: {
    catagoryimage:[],
    items: [],
    categories:[],
    selectedCategory: "ALL",
    singleItem: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProduct.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch products";
      })
        .addCase(fetchCatagoryImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCatagoryImage.fulfilled, (state, action) => {
        state.loading = false;
        state.catagoryimage = action.payload;
      })
      .addCase(fetchCatagoryImage.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch images";
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleItem = action.payload;
      })
      .addCase(fetchProductById.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch users";
      });
      builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch users";
      });
  },
});

export default productSlice.reducer;
