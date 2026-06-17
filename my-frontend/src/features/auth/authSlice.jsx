import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

/* ---------------- SIGNUP ---------------- */
export const sigUpUser = createAsyncThunk(

'auth/signUp',
async(userData, thunkAPI) =>{
  try{
    const response = await api.post("register/",userData)
  return response.data
  }
  catch(error){
    return thunkAPI.rejectWithValue(error.response.data);
  }
  
}

)

/* ---------------- LOGIN (JWT) -------------- */

export const loginUser = createAsyncThunk(
  'auth/login', 
  async(credentials,thunkAPI) =>{
  try{
    const response = await api.post("login/",credentials)

     localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      return response.data
  }
  
     catch(error){
    return thunkAPI.rejectWithValue(error.response.data);
  
}
  }
)


// ================= FORGOT PASSWORD =================
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, thunkAPI) => {
    try {
      const res = await api.post("request-reset/", { email });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// ================= RESET PASSWORD =================
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ uid, token, password }, thunkAPI) => {
    try {
      const res = await api.post("reset-password/", {
        uid,
        token,
        password,
      });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);




export const fetchUser= createAsyncThunk(

'fetch/user',
async(_, thunkAPI) =>{
  try{
    const response = await api.get("me/")
  return response.data
  }
  catch(error){ 
    console.log("ERROR DATA:", error.response?.data);
    return thunkAPI.rejectWithValue(error.response.data);
  }
  
}

)

const authSlice = createSlice({
  name :'auth',
  initialState:{
  user :null,
  registered:false,
  loading :false,
  error:false,
  checkedAuth: false, 
  isAuthenticated: !!localStorage.getItem("access"),
},
reducers:{
  logout:(state) =>{
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    state.isAuthenticated = false;
    state.user=null;
    state.checkedAuth = true;
  },
},
extraReducers:(builder)=>{
  builder
  .addCase(sigUpUser.pending,(state)=>{
   state.loading=true;
  })
  .addCase(sigUpUser.fulfilled,(state)=>{
   state.loading=false;
    state.registered=true;
  })
  .addCase(sigUpUser.rejected,(state,action)=>{
   state.loading=false;
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
     .addCase(fetchUser.fulfilled, (state,action) => {
     state.user = action.payload; 
     state.error = false;
      state.checkedAuth = true;
     })
     .addCase(fetchUser.rejected, (state) => {
  state.user = null;
  state.isAuthenticated = false;
    state.checkedAuth = true;

}).addCase(forgotPassword.pending, (state) => {
  state.loading = true;
})
.addCase(forgotPassword.fulfilled, (state) => {
  state.loading = false;
})
.addCase(forgotPassword.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})

.addCase(resetPassword.pending, (state) => {
  state.loading = true;
})
.addCase(resetPassword.fulfilled, (state) => {
  state.loading = false;
})
.addCase(resetPassword.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})
},
})

export const { logout } = authSlice.actions; 
export default authSlice.reducer;

