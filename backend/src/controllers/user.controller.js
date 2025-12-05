import User from "../models/User.js";

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role } = req.query;
    const filter = {};
    if (role) filter.role = role;
    
    const query = User.find(filter).select("-password").sort("-createdAt").skip((+page - 1) * +limit).limit(+limit);
    const [users, total] = await Promise.all([query, User.countDocuments(filter)]);
    
    res.json({
      success: true,
      data: users,
      total,
      page: +page,
      limit: +limit,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    // Build update object with all possible fields
    const fieldsToUpdate = {};
    
    // Basic user fields
    if (req.body.name !== undefined) fieldsToUpdate.name = req.body.name;
    if (req.body.phone !== undefined) fieldsToUpdate.phone = req.body.phone;
    if (req.body.address !== undefined) fieldsToUpdate.address = req.body.address;
    if (req.body.profileImage !== undefined) fieldsToUpdate.profileImage = req.body.profileImage;
    if (req.body.profileImageRef !== undefined) fieldsToUpdate.profileImageRef = req.body.profileImageRef;
    if (req.body.preferences !== undefined) fieldsToUpdate.preferences = req.body.preferences;
    
    // Farm details (basic)
    if (req.body.farmDetails !== undefined) fieldsToUpdate.farmDetails = req.body.farmDetails;
    
    // Extended farmer profile fields
    if (req.body.farmerProfile !== undefined) {
      fieldsToUpdate.farmerProfile = req.body.farmerProfile;
    } else {
      // Handle individual farmer profile fields for backward compatibility
      if (req.body.farmName !== undefined || req.body.description !== undefined || 
          req.body.farmingPractices !== undefined || req.body.establishedYear !== undefined ||
          req.body.socialMedia !== undefined || req.body.businessHours !== undefined ||
          req.body.acceptsPickup !== undefined || req.body.acceptsDelivery !== undefined ||
          req.body.deliveryRadius !== undefined) {
        fieldsToUpdate.farmerProfile = {};
        if (req.body.farmName !== undefined) fieldsToUpdate.farmerProfile.farmName = req.body.farmName;
        if (req.body.description !== undefined) fieldsToUpdate.farmerProfile.description = req.body.description;
        if (req.body.farmingPractices !== undefined) fieldsToUpdate.farmerProfile.farmingPractices = req.body.farmingPractices;
        if (req.body.establishedYear !== undefined) fieldsToUpdate.farmerProfile.establishedYear = req.body.establishedYear;
        if (req.body.socialMedia !== undefined) fieldsToUpdate.farmerProfile.socialMedia = req.body.socialMedia;
        if (req.body.businessHours !== undefined) fieldsToUpdate.farmerProfile.businessHours = req.body.businessHours;
        if (req.body.acceptsPickup !== undefined) fieldsToUpdate.farmerProfile.acceptsPickup = req.body.acceptsPickup;
        if (req.body.acceptsDelivery !== undefined) fieldsToUpdate.farmerProfile.acceptsDelivery = req.body.acceptsDelivery;
        if (req.body.deliveryRadius !== undefined) fieldsToUpdate.farmerProfile.deliveryRadius = req.body.deliveryRadius;
      }
    }
    
    // Use $set to update nested fields properly
    const updateQuery = { $set: fieldsToUpdate };
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateQuery,
      { new: true, runValidators: true }
    )
      .populate("profileImageRef", "url storageType displayUrl");
    
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    
    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all farmers
// @route   GET /api/users/farmers
// @access  Public
export const getFarmers = async (req, res, next) => {
  try {
    const farmers = await User.find({ role: "farmer" })
      .select("-password")
      .populate("profileImageRef", "url storageType displayUrl")
      .sort("-createdAt");
    
    res.json({
      success: true,
      data: farmers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get farmer by ID
// @route   GET /api/users/farmers/:id
// @access  Public
export const getFarmerById = async (req, res, next) => {
  try {
    const farmer = await User.findOne({ 
      _id: req.params.id, 
      role: "farmer" 
    })
      .select("-password")
      .populate("profileImageRef", "url storageType displayUrl");
    
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found",
      });
    }
    
    res.json({
      success: true,
      data: { farmer, profile: farmer },
    });
  } catch (error) {
    next(error);
  }
};


