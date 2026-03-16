import Business from "../models/Business.js";
import cloudinary from "../config/cloudinary.js";

export const createBusiness = async (req, res) => {
  try {
    const { title, description, highlights, price } = req.body;

    if (!title || !description || !highlights || !price) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    let imageUrl = null;

    if (req.file) {
      const upload = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        { folder: "bizzmall" },
      );

      imageUrl = upload.secure_url;
    }
    const business = await Business.create({
      title: title,
      description: description,
      highlights: JSON.parse(highlights),
      price: price,
      coverImage: imageUrl,
    });

    res.status(201).json({
      message: "successfully created the business",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create the business",
      error: error.message,
    });
  }
};

export const updateBusiness = async (req, res) => {
  try {
    const businessId = req.params.id;
    const business = await Business.findByPk(businessId);
    if (!business)
      return res.status(404).json({
        message: "Business not found!",
      });

    const updateFields = {};
    const {
      title,
      description,
      highlights,
      price,
      current_price,
      is_featured,
      is_investment,
      is_ours,
    } = req.body;

    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (highlights) updateFields.highlights = JSON.parse(highlights);
    if (price) updateFields.price = price;
    if (current_price) updateFields.current_price = current_price;

    if (typeof is_featured !== "undefined")
      updateFields.is_featured = is_featured;

    if (typeof is_investment !== "undefined")
      updateFields.is_investment = is_investment;
    if (typeof is_ours !== "undefined") {
      updateFields.is_ours = is_ours;
    }
    if (req.file) {
      if (!process.env.CLOUDINARY_API_KEY) {
        throw new Error("Cloudinary not configured properly");
      }

      const upload = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        { folder: "bizzmall" },
      );

      updateFields.coverImage = upload.secure_url;
    }
    const updatedBusiness = await business.update(updateFields);
    res.status(200).json({
      message: "successfully updated the business",
    });
    console.log("FILE:", req.file);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update the businesss",
      error: error.message,
    });
  }
};

export const deleteBusiness = async (req, res) => {
  try {
    const businessId = req.params.id;
    const business = await Business.findByPk(businessId);

    if (!business)
      return res.status(404).json({
        message: "Business not found!",
      });

    await business.destroy();
    res.status(200).json({
      message: "successfully deleted the business",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete the business",
      error: error.message,
    });
  }
};

export const getBusiness = async (req, res) => {
  try {
    const businessId = req.params.id;
    const business = await Business.findByPk(businessId);

    if (!business)
      return res.status(404).json({
        message: "Business not found",
      });
    return res
      .status(200)
      .json({ message: "Succesfuly fetched the business", business });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch business",
      error: error.message,
    });
  }
};

export const getAllBusinesses = async (req, res) => {
  try {
    const { is_featured, is_investment, limit } = req.query;

    let whereClause = {};
    let options = {};

    if (is_featured !== undefined) {
      whereClause.is_featured = is_featured === "true";
    }

    if (is_investment !== undefined) {
      whereClause.is_investment = is_investment === "true";
    }

    if (limit) {
      options.limit = parseInt(limit);
    }

    const businesses = await Business.findAll({
      where: whereClause,
      ...options,
    });
    res.status(200).json({
      message: "Successfully fetched all the businesses",
      businesses,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get all the businesses",
      error: error.message,
    });
  }
};
