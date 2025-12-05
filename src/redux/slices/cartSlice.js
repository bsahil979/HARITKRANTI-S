import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// Get cart from localStorage
const cartItemsFromStorage = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];

const initialState = {
  cartItems: cartItemsFromStorage,
  farmerId:
    cartItemsFromStorage.length > 0 ? cartItemsFromStorage[0].farmerId : null,
  farmerName:
    cartItemsFromStorage.length > 0 ? cartItemsFromStorage[0].farmerName : null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity } = action.payload;
      
      // Check if it's an admin product
      const isAdminProduct = product.isAdminProduct || product.sellerType === "admin";
      const sellerId = isAdminProduct 
        ? (product.admin?._id || product.seller?._id || product.farmer?._id)
        : (product.farmer?._id || product.farmerId?._id);
      const sellerName = isAdminProduct
        ? (product.admin?.name || product.seller?.name || "Admin")
        : (product.farmer?.name || product.farmerId?.name);

      // Allow mixing admin products or farmer products, but not both
      const currentSellerType = state.cartItems.length > 0 
        ? (state.cartItems[0].isAdminProduct ? "admin" : "farmer")
        : null;
      
      if (currentSellerType && currentSellerType !== (isAdminProduct ? "admin" : "farmer")) {
        toast.error(
          "You can only order from one seller type at a time. Please clear your cart first."
        );
        return;
      }

      if (
        state.cartItems.length === 0 ||
        sellerId === state.farmerId ||
        (isAdminProduct && currentSellerType === "admin")
      ) {
        const existItem = state.cartItems.find(
          (item) => item.productId === product._id
        );

        if (existItem) {
          state.cartItems = state.cartItems.map((item) =>
            item.productId === product._id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
          toast.info(`Updated ${product.title || product.name} quantity in your cart`);
        } else {
          state.cartItems.push({
            productId: product._id,
            name: product.title || product.name,
            image:
              product.images && product.images.length > 0
                ? product.images[0]
                : (product.imageUrl || null),
            price: product.pricePerKg || product.price,
            quantity,
            farmerId: sellerId,
            farmerName: sellerName,
            isAdminProduct: isAdminProduct,
            adminProductId: isAdminProduct ? product._id : null,
          });

          if (state.farmerId === null) {
            state.farmerId = sellerId;
            state.farmerName = sellerName;
          }

          toast.success(`Added ${product.title || product.name} to your cart`);
        }
      } else {
        toast.error(
          "You can only order from one seller at a time. Please clear your cart first."
        );
        return;
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => item.productId !== productId
      );

      if (state.cartItems.length === 0) {
        state.farmerId = null;
        state.farmerName = null;
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      toast.info("Item removed from cart");
    },
    updateCartQuantity: (state, action) => {
      const { productId, quantity } = action.payload;

      state.cartItems = state.cartItems.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.farmerId = null;
      state.farmerName = null;

      localStorage.removeItem("cartItems");
      toast.info("Cart cleared");
    },
  },
});

export const { addToCart, removeFromCart, updateCartQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
