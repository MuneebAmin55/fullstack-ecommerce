import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";


export const createAddress = createAsyncThunk(

'checkout/address',
async(addressData, thunkAPI) =>{
  try{
    const response = await api.post("address/",addressData)
  return response.data
  }
  catch(error){ 
    console.log("ERROR DATA:", error.response?.data);
    return thunkAPI.rejectWithValue(error.response.data);
  }
}

)
export const fetchAddress = createAsyncThunk(

'fetch/address',
async(addressData, thunkAPI) =>{
  try{
    const response = await api.get("address/",addressData)
  return response.data
  }
  catch(error){ 
    console.log("ERROR DATA:", error.response?.data);
    return thunkAPI.rejectWithValue(error.response.data);
  }
  
}

)


const addressSlice = createSlice({
  name :'address',
  initialState:{
  isaddress:false,
  address:null,
  loading :false,
  error:false,
},
reducers:{},
extraReducers:(builder)=>{
  builder
  .addCase(createAddress.pending,(state)=>{
   state.loading=true;
  })
  .addCase(createAddress.fulfilled,(state,action)=>{
   state.loading=false;
    state.isaddress=true;
    state.address=action.payload;
  })
  .addCase(createAddress.rejected,(state,action)=>{
   state.loading=false;
   state.error = action.payload;
  })
  .addCase(fetchAddress.fulfilled,(state,action)=>{
    state.address=action.payload;
  })
  
},
})

export const { logout } = addressSlice.actions; 
export default addressSlice.reducer;

