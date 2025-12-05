import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "/api";

// Get all listings (admin)
export const getAllListings = createAsyncThunk(
  "listings/getAllListings",
  async (params = {}, { rejectWithValue }) => {
    try {
      let url = `${API_URL}/listings`;
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

// Get listing details
export const getListingDetails = createAsyncThunk(
  "listings/getListingDetails",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/listings/${id}`);
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

// Update listing (admin)
export const updateListing = createAsyncThunk(
  "listings/updateListing",
  async ({ id, listingData }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.patch(
        `${API_URL}/listings/${id}`,
        listingData,
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

// Delete listing (admin)
export const deleteListing = createAsyncThunk(
  "listings/deleteListing",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`${API_URL}/listings/${id}`, config);
      return id;
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
  listings: [],
  listing: null,
  total: 0,
  loading: false,
  error: null,
  success: false,
};

const listingSlice = createSlice({
  name: "listings",
  initialState,
  reducers: {
    clearListingError: (state) => {
      state.error = null;
    },
    resetListingSuccess: (state) => {
      state.success = false;
    },
    clearListingDetails: (state) => {
      state.listing = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all listings
      .addCase(getAllListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllListings.fulfilled, (state, action) => {
        state.loading = false;
        state.listings = action.payload.data || [];
        state.total = action.payload.total || 0;
      })
      .addCase(getAllListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get listing details
      .addCase(getListingDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getListingDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.listing = action.payload;
      })
      .addCase(getListingDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update listing
      .addCase(updateListing.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateListing.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.listings = state.listings.map((listing) =>
          listing._id === action.payload._id ? action.payload : listing
        );
        toast.success("Listing updated successfully!");
      })
      .addCase(updateListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Delete listing
      .addCase(deleteListing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteListing.fulfilled, (state, action) => {
        state.loading = false;
        state.listings = state.listings.filter(
          (listing) => listing._id !== action.payload
        );
        state.total -= 1;
        toast.success("Listing deleted successfully!");
      })
      .addCase(deleteListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { clearListingError, resetListingSuccess, clearListingDetails } =
  listingSlice.actions;

export default listingSlice.reducer;




