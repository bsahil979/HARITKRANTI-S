import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "/api";

// Get all purchases
export const getAllPurchases = createAsyncThunk(
  "purchases/getAllPurchases",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(`${API_URL}/purchases`, config);
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

// Create purchase
export const createPurchase = createAsyncThunk(
  "purchases/createPurchase",
  async (purchaseData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(`${API_URL}/purchases`, purchaseData, config);
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

// Update purchase status
export const updatePurchaseStatus = createAsyncThunk(
  "purchases/updatePurchaseStatus",
  async ({ id, status }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.patch(
        `${API_URL}/purchases/${id}/status`,
        { status },
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

const initialState = {
  purchases: [],
  loading: false,
  error: null,
  success: false,
};

const purchaseSlice = createSlice({
  name: "purchases",
  initialState,
  reducers: {
    clearPurchaseError: (state) => {
      state.error = null;
    },
    resetPurchaseSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPurchases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPurchases.fulfilled, (state, action) => {
        state.loading = false;
        state.purchases = action.payload.data || [];
      })
      .addCase(getAllPurchases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPurchase.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createPurchase.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.purchases.push(action.payload.data);
        const message = action.payload.message || "Product purchased successfully! Added to inventory.";
        toast.success(message);
      })
      .addCase(createPurchase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(updatePurchaseStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePurchaseStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.purchases = state.purchases.map((purchase) =>
          purchase._id === action.payload.data._id ? action.payload.data : purchase
        );
        toast.success("Purchase status updated!");
      })
      .addCase(updatePurchaseStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { clearPurchaseError, resetPurchaseSuccess } = purchaseSlice.actions;
export default purchaseSlice.reducer;

