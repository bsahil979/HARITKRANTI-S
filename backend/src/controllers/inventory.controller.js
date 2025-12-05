import Inventory from "../models/Inventory.js";
import AdminProduct from "../models/AdminProduct.js";

// Get all inventory items (admin)
export const getAllInventory = async (req, res, next) => {
  try {
    const inventory = await Inventory.find({ admin: req.user._id })
      .populate("purchase")
      .populate("sourceFarmer", "name email")
      .sort("-createdAt");
    res.json({ success: true, data: inventory });
  } catch (error) {
    next(error);
  }
};

// Get single inventory item
export const getInventoryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Inventory.findById(id)
      .populate("purchase")
      .populate("sourceFarmer", "name email");

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// Update inventory item
export const updateInventory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const item = await Inventory.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate("purchase")
      .populate("sourceFarmer", "name email");

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// List product in marketplace (create AdminProduct)
export const listProductInMarketplace = async (req, res, next) => {
  try {
    const { inventoryId, sellingPrice, quantity } = req.body;

    const inventory = await Inventory.findById(inventoryId);
    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    if (inventory.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to list this inventory",
      });
    }

    if (quantity > inventory.availableQuantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient quantity in inventory",
      });
    }

    const adminProduct = await AdminProduct.create({
      admin: req.user._id,
      inventory: inventoryId,
      name: inventory.name,
      description: inventory.description,
      category: inventory.category,
      images: inventory.images,
      price: sellingPrice || inventory.sellingPrice,
      pricePerKg: sellingPrice || inventory.sellingPrice,
      quantity: quantity || inventory.availableQuantity,
      unit: inventory.unit,
      status: "available",
      isAdminProduct: true,
      adminMarkup: sellingPrice - inventory.purchasePrice,
    });

    // Update inventory status
    inventory.status = "listed";
    await inventory.save();

    res.status(201).json({ success: true, data: adminProduct });
  } catch (error) {
    next(error);
  }
};

// Get all admin products (for marketplace)
export const getAllAdminProducts = async (req, res, next) => {
  try {
    const { status } = req.query;
    // Build filter - show available products by default, or filter by requested status
    const filter = {};
    if (status && status !== "all") {
      filter.status = status;
    } else {
      // Default: show available products (or products that should be available)
      filter.$or = [
        { status: "available" },
        { status: { $exists: false } } // Backward compatibility
      ];
    }
    
    const products = await AdminProduct.find(filter)
      .populate("admin", "name")
      .populate("inventory")
      .sort("-createdAt");
    
    // Sync AdminProduct.quantity with inventory.availableQuantity (inventory is source of truth)
    for (const product of products) {
      if (product.inventory) {
        // Always sync with inventory (inventory is source of truth)
        const inventoryQty = product.inventory.availableQuantity || 0;
        if (product.quantity !== inventoryQty) {
          product.quantity = inventoryQty;
          if (product.quantity === 0) {
            product.status = "out_of_stock";
          } else if (product.status === "out_of_stock" && product.quantity > 0) {
            product.status = "available";
          }
          await product.save();
        }
      }
    }
    
    // Re-fetch to get updated quantities (use same filter)
    const updatedProducts = await AdminProduct.find(filter)
      .populate("admin", "name")
      .populate("inventory")
      .sort("-createdAt");
    
    // Ensure all products have correct quantity from inventory (ALWAYS use inventory as source of truth)
    const finalProducts = updatedProducts
      .map((product) => {
        // Handle both populated and ObjectId inventory references
        const inventory = product.inventory;
        if (inventory) {
          const inventoryQty = inventory.availableQuantity || 0;
          // ALWAYS override quantity with inventory value for response (inventory is source of truth)
          const productObj = product.toObject();
          productObj.quantity = inventoryQty;
          // Also update status based on inventory quantity
          if (inventoryQty === 0 && productObj.status !== "out_of_stock") {
            productObj.status = "out_of_stock";
          } else if (inventoryQty > 0 && productObj.status === "out_of_stock") {
            productObj.status = "available";
          }
          return productObj;
        }
        return product;
      })
      // Filter out products with 0 inventory quantity (they shouldn't be in marketplace)
      .filter((product) => {
        const inventory = product.inventory;
        if (inventory) {
          return (inventory.availableQuantity || 0) > 0;
        }
        // If no inventory, check product quantity
        return (product.quantity || 0) > 0;
      });
    
    res.json({ success: true, data: finalProducts });
  } catch (error) {
    next(error);
  }
};

