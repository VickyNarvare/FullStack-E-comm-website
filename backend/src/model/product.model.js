import mongoose from 'mongoose';
const productSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 20,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    minlength: 30,
    maxlength: 100,
  },
  category: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  price: {
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      enum: ['INR', 'USD'],
      default: 'INR',
    },
  },
  images: {
    type: [String],
    default: [],
    validate: {
      validator: (images) => !images || images.length <= 5,
      message: 'A product can have at most 5 images',
    },
  },
});

const productModel = mongoose.model('products', productSchema);
export default productModel;
