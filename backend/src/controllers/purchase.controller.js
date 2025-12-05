import Purchase from "../models/Purchase.js";
import Inventory from "../models/Inventory.js";
import Product from "../models/Product.js";

// Get all purchases (admin)
export const getAllPurchases = async (req, res, next) => {
  try {
    const purchases = await Purchase.find({ admin: req.user._id })
      .populate("product")
      .populate("farmer", "name email phone")
      .sort("-createdAt");
    res.json({ success: true, data: purchases });
  } catch (error) {
    next(error);
  }
};

// Create purchase (admin buys from farmer)
export const createPurchase = async (req, res, next) => {
  try {
    const { productId, listingId, quantity, purchasePrice, notes } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "productId is required",
      });
    }

    const sourceProduct = await Product.findById(productId)
      .populate("farmerId")
      .populate("farmer");
    
    if (!sourceProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    
    const farmer = sourceProduct.farmerId || sourceProduct.farmer;

    if (!farmer) {
      return res.status(400).json({
        success: false,
        message: "Farmer information not found",
      });
    }

    // Check available quantity
    const availableQty = sourceProduct.quantityAvailable || sourceProduct.quantityKg || sourceProduct.quantity || 0;
    
    if (quantity > availableQty) {
      return res.status(400).json({
        success: false,
        message: `Insufficient quantity. Available: ${availableQty} ${sourceProduct.unit || "kg"}`,
      });
    }

    const totalAmount = (purchasePrice || sourceProduct.pricePerKg || sourceProduct.price || 0) * quantity;

    // Update product quantity (reduce available quantity)
    const remainingQty = availableQty - quantity;
    sourceProduct.quantityAvailable = remainingQty;
    sourceProduct.quantityKg = remainingQty;
    sourceProduct.quantity = remainingQty;
    
    // Update status if quantity becomes 0
    if (remainingQty === 0) {
      sourceProduct.status = "out_of_stock";
    }
    
    await sourceProduct.save();

    const purchase = await Purchase.create({
      product: productId,
      farmer: farmer._id,
      admin: req.user._id,
      quantity,
      unit: sourceProduct.unit || "kg",
      purchasePrice: purchasePrice || sourceProduct.pricePerKg || sourceProduct.price || 0,
      totalAmount,
      notes: notes || "",
      status: "completed", // Auto-complete purchase
    });

    // Create inventory item
    await Inventory.create({
      admin: req.user._id,
      purchase: purchase._id,
      name: sourceProduct.name || sourceProduct.title,
      description: sourceProduct.description || "",
      category: sourceProduct.category || "other",
      images: sourceProduct.images || (sourceProduct.imageUrl ? [sourceProduct.imageUrl] : []),
      totalQuantity: quantity,
      availableQuantity: quantity,
      soldQuantity: 0,
      unit: sourceProduct.unit || "kg",
      purchasePrice: purchasePrice || sourceProduct.pricePerKg || sourceProduct.price || 0,
      sellingPrice: (purchasePrice || sourceProduct.pricePerKg || sourceProduct.price || 0) * 1.2, // 20% markup by default
      sourceFarmer: farmer._id,
      sourceProduct: productId,
      status: "in_stock",
    });

    await purchase.populate("product");
    await purchase.populate("farmer", "name email phone");

    res.status(201).json({ 
      success: true, 
      data: purchase,
      message: `Purchased ${quantity} ${sourceProduct.unit || "kg"}. ${remainingQty} ${sourceProduct.unit || "kg"} remaining in farmer's stock.`
    });
  } catch (error) {
    next(error);
  }
};

// Update purchase status
export const updatePurchaseStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const purchase = await Purchase.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )
      .populate("product")
      .populate("farmer", "name email phone");

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    res.json({ success: true, data: purchase });
  } catch (error) {
    next(error);
  }
};

