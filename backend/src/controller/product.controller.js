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

    const photoURL = [];

    for (const file of uploadedFiles) {
      const response = await uploadFiles({
        buffer: file.buffer,
        fileName: file.originalname,
      });
      photoURL.push(response.url);
    }

    const parsedPrice =
      typeof req.body.price === 'string'
        ? JSON.parse(req.body.price)
        : req.body.price;

    await productModel.create({
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
      images: photoURL,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Product upload failed',
      error: error.message,
    });
  }
};
