import Image from "../models/Image.js";
import { uploadBufferToCloudinary } from "../utils/upload.js";

// @desc    Upload image
// @route   POST /api/images/upload
// @access  Private
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    const { imageType = "other", referencedBy, referencedModel } = req.body;
    const userId = req.user._id;

    // Upload to Cloudinary
    let cloudinaryResult = null;
    let imageUrl = "";
    let storageType = "base64"; // Default to base64 if Cloudinary fails

    try {
      // Determine folder based on image type
      let folder = "haritkranti";
      if (imageType === "profile") folder = "haritkranti/profiles";
      else if (imageType === "product") folder = "haritkranti/products";
      else if (imageType === "farm") folder = "haritkranti/farms";

      cloudinaryResult = await uploadBufferToCloudinary(
        req.file.buffer,
        req.file.originalname,
        folder
      );

      imageUrl = cloudinaryResult.secure_url;
      storageType = "url";
    } catch (cloudinaryError) {
      console.error("Cloudinary upload failed, storing as base64:", cloudinaryError);
      // Fallback to base64 if Cloudinary fails
      imageUrl = req.file.buffer.toString("base64");
      storageType = "base64";
    }

    // Create image document
    const image = await Image.create({
      url: imageUrl,
      storageType,
      filename: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      width: cloudinaryResult?.width || null,
      height: cloudinaryResult?.height || null,
      imageType,
      uploadedBy: userId,
      referencedBy: referencedBy || null,
      referencedModel: referencedModel || null,
      cloudinaryId: cloudinaryResult?.public_id || null,
      cloudinaryUrl: cloudinaryResult?.secure_url || null,
    });

    res.status(201).json({
      success: true,
      data: image,
      message: "Image uploaded successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload multiple images
// @route   POST /api/images/upload-multiple
// @access  Private
export const uploadMultipleImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No image files provided",
      });
    }

    const { imageType = "other", referencedBy, referencedModel } = req.body;
    const userId = req.user._id;

    const uploadedImages = [];

    for (const file of req.files) {
      // Upload to Cloudinary
      let cloudinaryResult = null;
      let imageUrl = "";
      let storageType = "base64";

      try {
        let folder = "haritkranti";
        if (imageType === "profile") folder = "haritkranti/profiles";
        else if (imageType === "product") folder = "haritkranti/products";
        else if (imageType === "farm") folder = "haritkranti/farms";

        cloudinaryResult = await uploadBufferToCloudinary(
          file.buffer,
          file.originalname,
          folder
        );

        imageUrl = cloudinaryResult.secure_url;
        storageType = "url";
      } catch (cloudinaryError) {
        console.error("Cloudinary upload failed, storing as base64:", cloudinaryError);
        imageUrl = file.buffer.toString("base64");
        storageType = "base64";
      }

      const image = await Image.create({
        url: imageUrl,
        storageType,
        filename: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        width: cloudinaryResult?.width || null,
        height: cloudinaryResult?.height || null,
        imageType,
        uploadedBy: userId,
        referencedBy: referencedBy || null,
        referencedModel: referencedModel || null,
        cloudinaryId: cloudinaryResult?.public_id || null,
        cloudinaryUrl: cloudinaryResult?.secure_url || null,
      });

      uploadedImages.push(image);
    }

    res.status(201).json({
      success: true,
      data: uploadedImages,
      message: `${uploadedImages.length} image(s) uploaded successfully`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get image by ID
// @route   GET /api/images/:id
// @access  Public (or Private if needed)
export const getImage = async (req, res, next) => {
  try {
    const image = await Image.findById(req.params.id)
      .populate("uploadedBy", "name email")
      .populate("referencedBy");

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    res.json({
      success: true,
      data: image,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get images by user
// @route   GET /api/images/user/:userId
// @access  Private
export const getUserImages = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.user._id;
    const { imageType } = req.query;

    const filter = { uploadedBy: userId, isActive: true };
    if (imageType) filter.imageType = imageType;

    const images = await Image.find(filter).sort("-createdAt");

    res.json({
      success: true,
      data: images,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get images by reference
// @route   GET /api/images/reference/:model/:id
// @access  Public
export const getImagesByReference = async (req, res, next) => {
  try {
    const { model, id } = req.params;

    const images = await Image.find({
      referencedBy: id,
      referencedModel: model,
      isActive: true,
    }).sort("createdAt");

    res.json({
      success: true,
      data: images,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete image
// @route   DELETE /api/images/:id
// @access  Private
export const deleteImage = async (req, res, next) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    // Check authorization
    if (
      image.uploadedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this image",
      });
    }

    // Soft delete
    image.isActive = false;
    await image.save();

    // TODO: Optionally delete from Cloudinary if storageType is "url"

    res.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update image reference
// @route   PATCH /api/images/:id/reference
// @access  Private
export const updateImageReference = async (req, res, next) => {
  try {
    const { referencedBy, referencedModel } = req.body;

    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    // Check authorization
    if (
      image.uploadedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this image",
      });
    }

    image.referencedBy = referencedBy || image.referencedBy;
    image.referencedModel = referencedModel || image.referencedModel;
    await image.save();

    res.json({
      success: true,
      data: image,
      message: "Image reference updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

