import productModel from '../model/product.model.js';
import { uploadFiles } from '../servers/storage.servers.js';

export const createProduct = async (req, res) => {
  try {
    const uploadedFiles =
      req.files?.productFiles || req.files?.images || req.files?.files || [];

    if (uploadedFiles.length === 0) {
      return res
        .status(400)
        .json({ message: 'At least one image is required.' });
    }

    const photoURL = await Promise.all(
      uploadedFiles.map(async (file) => {
        const response = await uploadFiles({
          buffer: file.buffer,
          fileName: file.originalname,
        });
        return response.url;
      })
    );

    const parsedPrice =
      typeof req.body.price === 'string'
        ? JSON.parse(req.body.price)
        : req.body.price;

    const product = await productModel.create({
      title: req.body.title,
      description: req.body.description,
      stock: Number(req.body.stock),
      category: req.body.category,
      userId: req.body.userId,
      price: {
        amount: Number(parsedPrice.amount),
        currency: parsedPrice.currency,
      },
      images: photoURL,
    });

    return res.status(201).json({
      message: 'Product images uploaded successfully',
      product: { product },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Product upload failed',
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(400).json({
        message: 'Invalid product id.',
      });
    }

    const deletedProduct = await productModel.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({
        message: 'Product not found.',
      });
    }

    return res.status(200).json({
      message: 'Product deleted successfully.',
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Invalid product id.',
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: 'Product not found.',
      });
    }

    const parsedPrice =
      typeof req.body.price === 'string'
        ? JSON.parse(req.body.price)
        : req.body.price;
    const uploadedFiles =
      req.files?.productFiles || req.files?.images || req.files?.files || [];
    const existingImages = req.body.existingImages
      ? JSON.parse(req.body.existingImages)
      : product.images;

    const update = {
      title: req.body.title,
      description: req.body.description,
      stock: Number(req.body.stock),
      category: req.body.category,
      price: {
        amount: Number(parsedPrice.amount),
        currency: parsedPrice.currency,
      },
    };

    if (uploadedFiles.length > 0) {
      const uploadedImageUrls = await Promise.all(
        uploadedFiles.map(async (file) => {
          const response = await uploadFiles({
            buffer: file.buffer,
            fileName: file.originalname,
          });
          return response.url;
        })
      );
      update.images = [...existingImages, ...uploadedImageUrls];
    } else if (req.body.existingImages) {
      update.images = existingImages;
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      productId,
      update,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: 'Product updated successfully.',
      product: updatedProduct,
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Product update failed.',
      error: error.message,
    });
  }
};

export const getAllProduct = async (req, res) => {
  try {
    const allproducts = await productModel.find();
    return res.status(200).json({
      message: 'all product fatched successfully.',
      product: { allproducts },
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Invalid request.',
      error: error.message,
    });
  }
};
