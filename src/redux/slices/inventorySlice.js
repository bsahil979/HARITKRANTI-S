import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "/api";

// Get all inventory items
export const getAllInventory = createAsyncThunk(
  "inventory/getAllInventory",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(`${API_URL}/inventory`, config);
      return data;
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      return rejectWithValue(message);
    }
  }
);

// Update inventory item
export const updateInventory = createAsyncThunk(
  "inventory/updateInventory",
  async ({ id, inventoryData }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.patch(
        `${API_URL}/inventory/${id}`,
        inventoryData,
        config
      );
      return data;
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      return rejectWithValue(message);
    }
  }
);

// List product in marketplace
export const listProductInMarketplace = createAsyncThunk(
  "inventory/listProductInMarketplace",
  async (listData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        `${API_URL}/inventory/list`,
        listData,
        config
      );
      return data;
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      return rejectWithValue(message);
    }
  }
);

// Get all admin products for marketplace
export const getAdminProducts = createAsyncThunk(
  "inventory/getAdminProducts",
  async (params = {}, { rejectWithValue }) => {
    try {
      let url = `${API_URL}/inventory/marketplace/products`;
      if (Object.keys(params).length > 0) {
        const queryParams = new URLSearchParams();
        for (const key in params) {
          if (params[key]) {
            queryParams.append(key, params[key]);
          }
        }
        url += `?${queryParams.toString()}`;
      }
      const { data } = await axios.get(url);
      return data;
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  inventory: [],
  adminProducts: [],
  loading: false,
  error: null,
  success: false,
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    clearInventoryError: (state) => {
      state.error = null;
    },
    resetInventorySuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.inventory = action.payload.data || [];
      })
      .addCase(getAllInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.inventory = state.inventory.map((item) =>
          item._id === action.payload.data._id ? action.payload.data : item
        );
        toast.success("Inventory updated successfully!");
      })
      .addCase(updateInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(listProductInMarketplace.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(listProductInMarketplace.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.adminProducts.push(action.payload.data);
        toast.success("Product listed in marketplace successfully!");
      })
      .addCase(listProductInMarketplace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(getAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.adminProducts = action.payload.data || [];
      })
      .addCase(getAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearInventoryError, resetInventorySuccess } = inventorySlice.actions;
export default inventorySlice.reducer;




