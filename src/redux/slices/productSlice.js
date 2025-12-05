import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import fallbackProducts from "../../data/Products";

const API_URL = import.meta.env.VITE_API_URL || "/api";

export const getProducts = createAsyncThunk(
  "products/getProducts",
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      let url = `${API_URL}/products`;

      if (Object.keys(params).length > 0) {
        const queryParams = new URLSearchParams();
        for (const key in params) {
          if (params[key]) {
            queryParams.append(key, params[key]);
          }
        }
        url += `?${queryParams.toString()}`;
      }

      // Include auth token if available (so admin can see all products including pending)
      const token = getState().auth?.token;
      const config = token ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      } : {};

      console.log("Fetching products from API:", url);
      const { data } = await axios.get(url, config);
      console.log("Products API response:", data);
      return data;
    } catch (error) {
      console.log("Products API error:", error.message);
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      return rejectWithValue(message);
    }
  }
);

export const getProductDetails = createAsyncThunk(
  "products/getProductDetails",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/products/${id}`);
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

export const getFarmerProducts = createAsyncThunk(
  "products/getFarmerProducts",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(`${API_URL}/products/farmer/me`, config);
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

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;

      const isFormData = typeof FormData !== "undefined" && productData instanceof FormData;
      const headers = { Authorization: `Bearer ${token}` };
      if (!isFormData) headers["Content-Type"] = "application/json";

      const { data } = await axios.post(`${API_URL}/products`, productData, { headers });
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

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(
        `${API_URL}/products/${id}`,
        productData,
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

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(`${API_URL}/products/${id}`, config);
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
  products: [],
  product: null,
  farmerProducts: [],
  loading: false,
  error: null,
  success: false,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
    resetProductSuccess: (state) => {
      state.success = false;
    },
    clearProductDetails: (state) => {
      state.product = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all products
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        const apiProducts = Array.isArray(action.payload?.data) ? action.payload.data : [];
        // Map products to include farmer data in consistent format
        state.products = apiProducts.map((product) => ({
          ...product,
          farmer: product.farmerId || product.farmer,
          images: product.images || (product.imageUrl ? [product.imageUrl] : []),
          pricePerKg: product.pricePerKg || product.price,
          quantityAvailable: product.quantityAvailable || product.quantity,
        }));
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        // Use fallback products on error
        state.products = fallbackProducts;
        state.error = action.payload;
      })
      // Get product details
      .addCase(getProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.data;
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get farmer products
      .addCase(getFarmerProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFarmerProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.farmerProducts = action.payload.data;
      })
      .addCase(getFarmerProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.farmerProducts.push(action.payload.data);
        toast.success("Product created successfully!");
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.farmerProducts = state.farmerProducts.map((product) =>
          product._id === action.payload.data._id
            ? action.payload.data
            : product
        );
        toast.success("Product updated successfully!");
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.farmerProducts = state.farmerProducts.filter(
          (product) => product._id !== action.payload
        );
        toast.success("Product deleted successfully!");
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { clearProductError, resetProductSuccess, clearProductDetails } =
  productSlice.actions;

export default productSlice.reducer;
