import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

/* ---------------- SIGNUP ---------------- */
export const sigUpUser = createAsyncThunk(
  'auth/signUp',
  async (userData, thunkAPI) => {
    try {
      // Djoser expects: { email, username, password, re_password }
      const response = await api.post("auth/users/", userData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

/* ---------------- LOGIN (JWT) -------------- */
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, thunkAPI) => {
    try {
      // Djoser JWT expects: { email, password }
      const response = await api.post("auth/jwt/create/", credentials);

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// ================= FORGOT PASSWORD =================
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, thunkAPI) => {
    try {
      const res = await api.post("auth/reset-password-otp/", {
        email,
      });

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { detail: "Something went wrong." }
      );
    }
  }
);

// ================= RESET PASSWORD =================
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ email, otp, new_password }, thunkAPI) => {
    try {
      const res = await api.post(
        "auth/reset-password-otp/confirm/",
        {
          email,
          otp,
          new_password,
        }
      );

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { detail: "Something went wrong." }
      );
    }
  }
);

export const fetchUser = createAsyncThunk(
  'fetch/user',
  async (_, thunkAPI) => {
    try {
      // Djoser expects: GET /auth/users/me/
      const response = await api.get("auth/users/me/");
      return response.data;
    } catch (error) {
      console.log("ERROR DATA:", error.response?.data);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    registered: false,
    loading: false,
    error: null,
    checkedAuth: false,
    success: "",
    isAuthenticated: !!localStorage.getItem("access"),
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      state.isAuthenticated = false;
      state.user = null;
      state.checkedAuth = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sigUpUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(sigUpUser.fulfilled, (state) => {
        state.loading = false;
        state.registered = true;
      })
      .addCase(sigUpUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.error = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = false;
        state.checkedAuth = true;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.checkedAuth = true;
      })
      .addCase(forgotPassword.pending, (state) => {
    state.loading = true;
    state.error = null;
    state.success = "";
})

.addCase(forgotPassword.fulfilled, (state) => {
    state.loading = false;
    state.success = "OTP has been sent to your email.";
})

.addCase(forgotPassword.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
})
     .addCase(resetPassword.pending, (state) => {
    state.loading = true;
    state.error = null;
    state.success = "";
})

.addCase(resetPassword.fulfilled, (state) => {
    state.loading = false;
    state.success = "Password changed successfully.";
})

.addCase(resetPassword.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
})
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;