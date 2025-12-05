import Order from "../models/Order.js";
import Product from "../models/Product.js";
import AdminProduct from "../models/AdminProduct.js";
import Inventory from "../models/Inventory.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

// Create order
export const createOrder = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { items, seller, sellerType, orderType, pickupDetails, deliveryDetails, paymentMethod, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items are required",
      });
    }

    // Calculate total and validate items
    let totalAmount = 0;
    const processedItems = [];

    for (const item of items) {
      let product = null;
      let adminProduct = null;
      let inventory = null;

      // Check if it's an admin product
      if (item.isAdminProduct || item.adminProductId) {
        const adminProductId = item.adminProductId || item.productId;
        adminProduct = await AdminProduct.findById(adminProductId).populate("inventory");
        if (!adminProduct) {
          return res.status(404).json({
            success: false,
            message: `Admin product not found: ${adminProductId}`,
          });
        }

        // Get inventory first (source of truth for available quantity)
        // Handle both ObjectId and populated inventory
        let inventoryData = adminProduct.inventory;
        
        // If inventory is populated (object), use it directly
        // If it's just an ID, fetch it
        if (inventoryData && typeof inventoryData === 'object' && inventoryData._id) {
          inventory = inventoryData;
        } else {
          const inventoryId = inventoryData || adminProduct.inventory;
          inventory = await Inventory.findById(inventoryId);
        }
        
        if (!inventory) {
          console.error(`[ORDER] Inventory not found for AdminProduct ${adminProduct._id}, inventory ref:`, adminProduct.inventory);
          return res.status(404).json({
            success: false,
            message: "Inventory item not found for this product",
          });
        }

        // Use ONLY inventory.availableQuantity as source of truth (not Math.min)
        const availableQty = inventory.availableQuantity || 0;
        
        console.log(`[ORDER] Checking quantity for ${adminProduct.name}:`, {
          adminProductId: adminProduct._id,
          inventoryId: inventory._id,
          inventoryAvailableQty: inventory.availableQuantity,
          adminProductQty: adminProduct.quantity,
          requestedQty: item.quantity,
          availableQty: availableQty
        });

        if (item.quantity > availableQty) {
          console.error(`[ORDER] Quantity check failed:`, {
            productName: adminProduct.name,
            requested: item.quantity,
            available: availableQty,
            inventoryId: inventory._id,
            inventoryTotal: inventory.totalQuantity,
            inventorySold: inventory.soldQuantity,
            inventoryAvailable: inventory.availableQuantity,
            adminProductQty: adminProduct.quantity
          });
          return res.status(400).json({
            success: false,
            message: `Insufficient quantity for ${adminProduct.name}. Available: ${availableQty} ${inventory.unit || adminProduct.unit || "kg"}. Inventory ID: ${inventory._id}`,
            debug: {
              inventoryId: inventory._id,
              totalQuantity: inventory.totalQuantity,
              availableQuantity: inventory.availableQuantity,
              soldQuantity: inventory.soldQuantity,
              adminProductQuantity: adminProduct.quantity
            }
          });
        }

        // Always sync adminProduct.quantity with inventory (inventory is source of truth)
        if (adminProduct.quantity !== inventory.availableQuantity) {
          adminProduct.quantity = inventory.availableQuantity;
          if (adminProduct.quantity === 0) {
            adminProduct.status = "out_of_stock";
          } else if (adminProduct.status === "out_of_stock" && adminProduct.quantity > 0) {
            adminProduct.status = "available";
          }
          await adminProduct.save();
        }

        totalAmount += (adminProduct.price || adminProduct.pricePerKg || 0) * item.quantity;
        processedItems.push({
          product: null,
          adminProduct: adminProduct._id,
          inventory: inventory._id,
          name: adminProduct.name,
          quantity: item.quantity,
          price: adminProduct.price || adminProduct.pricePerKg || 0,
          unit: adminProduct.unit || "kg",
        });
      } else {
        // Regular farmer product
        product = await Product.findById(item.productId);
        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Product not found: ${item.productId}`,
          });
        }

        // Check quantity
        const availableQty = product.quantityAvailable || product.quantityKg || product.quantity || 0;
        if (item.quantity > availableQty) {
          return res.status(400).json({
            success: false,
            message: `Insufficient quantity for ${product.name}. Available: ${availableQty} ${product.unit || "kg"}`,
          });
        }

        totalAmount += (product.pricePerKg || product.price || 0) * item.quantity;
        processedItems.push({
          product: product._id,
          adminProduct: null,
          inventory: null,
          name: product.name || product.title,
          quantity: item.quantity,
          price: product.pricePerKg || product.price || 0,
          unit: product.unit || "kg",
        });
      }
    }

    // Determine seller
    let sellerId = seller;
    let sellerTypeValue = sellerType || "farmer";

    if (!sellerId && processedItems.length > 0) {
      // If admin product, seller is admin
      if (processedItems[0].adminProduct) {
        const firstAdminProduct = await AdminProduct.findById(processedItems[0].adminProduct);
        sellerId = firstAdminProduct.admin;
        sellerTypeValue = "admin";
      } else if (processedItems[0].product) {
        // If farmer product, get farmer
        const firstProduct = await Product.findById(processedItems[0].product);
        sellerId = firstProduct.farmerId || firstProduct.farmer;
        sellerTypeValue = "farmer";
      }
    }

    // Create order
    const order = await Order.create({
      consumer: userId,
      seller: sellerId,
      sellerType: sellerTypeValue,
      items: processedItems,
      totalAmount,
      orderType: orderType || "delivery",
      pickupDetails: pickupDetails || {},
      deliveryDetails: deliveryDetails || {},
      paymentMethod: paymentMethod || "cash",
      notes: notes || "",
      status: "pending",
    });

    // Update quantities and inventory
    for (const item of processedItems) {
      if (item.adminProduct) {
        // Update inventory first (source of truth)
        if (item.inventory) {
          const inv = await Inventory.findById(item.inventory);
          if (inv) {
            inv.availableQuantity -= item.quantity;
            inv.soldQuantity += item.quantity;
            if (inv.availableQuantity === 0) {
              inv.status = "out_of_stock";
            } else if (inv.availableQuantity < 10) {
              inv.status = "low_stock";
            }
            await inv.save();

            // Sync admin product quantity with inventory (inventory is source of truth)
            const adminProd = await AdminProduct.findById(item.adminProduct);
            adminProd.quantity = inv.availableQuantity; // Always sync with inventory
            if (adminProd.quantity === 0) {
              adminProd.status = "out_of_stock";
            }
            await adminProd.save();
          }
        } else {
          // Fallback: update admin product directly if inventory not found
          const adminProd = await AdminProduct.findById(item.adminProduct);
          adminProd.quantity -= item.quantity;
          if (adminProd.quantity === 0) {
            adminProd.status = "out_of_stock";
          }
          await adminProd.save();
        }
      } else if (item.product) {
        // Update farmer product quantity
        const product = await Product.findById(item.product);
        if (product) {
          product.quantityAvailable = (product.quantityAvailable || product.quantityKg || product.quantity || 0) - item.quantity;
          product.quantityKg = product.quantityAvailable;
          product.quantity = product.quantityAvailable;
          if (product.quantityAvailable === 0) {
            product.status = "out_of_stock";
          }
          await product.save();
        }
      }
    }

    // Create notification for seller (admin or farmer)
    const sellerUser = await User.findById(sellerId);
    if (sellerUser) {
      await Notification.create({
        user: sellerId,
        type: "order_placed",
        title: "New Order Received",
        message: `You have received a new order of ₨${totalAmount.toFixed(2)} from ${req.user.name}`,
        relatedId: order._id,
        relatedType: "order",
        link: `/admin/orders/${order._id}`,
      });
    }

    await order.populate("consumer", "name email phone");
    await order.populate("seller", "name email phone");
    await order.populate("items.product");
    await order.populate("items.adminProduct");

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// Get consumer orders
export const getConsumerOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ consumer: req.user._id })
      .populate("seller", "name email phone")
      .populate("items.product")
      .populate("items.adminProduct")
      .sort("-createdAt");
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

// Get farmer orders
export const getFarmerOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ seller: req.user._id, sellerType: "farmer" })
      .populate("consumer", "name email phone")
      .populate("items.product")
      .sort("-createdAt");
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

// Get admin orders
export const getAdminOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ seller: req.user._id, sellerType: "admin" })
      .populate("consumer", "name email phone")
      .populate("items.adminProduct")
      .populate("items.inventory")
      .sort("-createdAt");
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

// Get all orders (admin only)
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("consumer", "name email phone")
      .populate("seller", "name email phone")
      .populate("items.product")
      .populate("items.adminProduct")
      .sort("-createdAt");
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

// Get order details
export const getOrderDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate("consumer", "name email phone address")
      .populate("seller", "name email phone")
      .populate("items.product")
      .populate("items.adminProduct")
      .populate("items.inventory");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check authorization
    if (
      order.consumer._id.toString() !== req.user._id.toString() &&
      order.seller._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order",
      });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// Update order status
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check authorization (seller or admin can update)
    if (
      order.seller.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this order",
      });
    }

    const oldStatus = order.status;
    order.status = status;
    await order.save();

    // Create notification for consumer
    await Notification.create({
      user: order.consumer,
      type: `order_${status}`,
      title: `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your order #${order._id.toString().substring(0, 8)} has been ${status}`,
      relatedId: order._id,
      relatedType: "order",
      link: `/orders/${order._id}`,
    });

    // If order completed, update payment status
    if (status === "completed") {
      order.paymentStatus = "paid";
      await order.save();
    }

    await order.populate("consumer", "name email phone");
    await order.populate("seller", "name email phone");
    await order.populate("items.product");
    await order.populate("items.adminProduct");

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

