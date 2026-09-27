import { UploadCloud, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'Apparel',
  'Home',
  'Electronics',
  'Beauty',
  'Grocery',
  'Other',
];
const CURRENCIES = [
  { code: 'INR', symbol: '₹' },
  { code: 'USD', symbol: '$' },
];
const MAX_IMAGES = 5;

export default function ProductForm({
  onSubmit,
  submitting,
  submitLabel = 'Save product',
  initialValues,
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      stock: '',
      category: CATEGORIES[0],
      price: {
        amount: '',
        currency: 'INR',
      },
      images: [],
    },
  });

  const [images, setImages] = useState(initialValues?.images || []);
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const values = {
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      stock: initialValues?.stock ?? '',
      category: initialValues?.category || CATEGORIES[0],
      price: {
        amount: initialValues?.price?.amount ?? '',
        currency: initialValues?.price?.currency || 'INR',
      },
      images: initialValues?.images || [],
    };
    reset(values);
    setImages(values.images);
    setFiles([]);
  }, [initialValues, reset]);

  // manually-controlled field: images are drag/drop + preview, so we register
  // them for validation only (max 5, at least 1) rather than via a plain input
  register('images', {
    validate: (value) => {
      if (!value || value.length === 0) return 'Add at least one product image';
      if (value.length > MAX_IMAGES)
        return `You can only add up to ${MAX_IMAGES} images`;
      return true;
    },
  });

  const addFiles = useCallback(
    (fileList) => {
      const files = Array.from(fileList);
      const validImages = files.filter((f) => f.type.startsWith('image/'));
      if (validImages.length !== files.length) {
        toast.error('Only image files are allowed.');
      }

      const room = MAX_IMAGES - images.length;
      if (room <= 0) {
        toast.error(`Maximum ${MAX_IMAGES} images allowed.`);
        return;
      }

      const accepted = validImages.slice(0, room);
      if (validImages.length > room) {
        toast.error(
          `Only ${room} more image${room === 1 ? '' : 's'} allowed (max ${MAX_IMAGES}).`
        );
      }

      setFiles((prev) => [...prev, ...accepted]);
      accepted.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          setImages((prev) => {
            if (prev.length >= MAX_IMAGES) return prev;
            const next = [...prev, reader.result];
            setValue('images', next, { shouldValidate: true });
            return next;
          });
        };
        reader.readAsDataURL(file);
      });
    },
    [images.length, setValue]
  );

  const removeImage = (index) => {
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== index);
      setFiles((current) => current.filter((_, i) => i !== index));
      setValue('images', next, { shouldValidate: true });
      return next;
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const submit = (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('stock', String(data.stock));
    formData.append('price', JSON.stringify(data.price));
    formData.append(
      'existingImages',
      JSON.stringify(images.filter((image) => !image.startsWith('data:')))
    );
    files.forEach((file) => formData.append('files', file));
    return onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="space-y-4 mx-auto"
      noValidate
    >
      <div>
        <label className="block text-sm mb-1.5 text-mist-dim">
          Product name
        </label>
        <input
          className="w-full bg-ink border border-ink-line rounded-card px-3.5 py-2.5 text-sm focus-ring"
          placeholder="Handwoven cotton tote bag"
          {...register('title', {
            required: 'Product name is required',
            minLength: { value: 20, message: 'Use at least 20 characters' },
            maxLength: {
              value: 100,
              message: 'Use no more than 100 characters',
            },
          })}
        />
        {errors.title && (
          <p className="text-xs text-red-400 mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Drag & drop image uploader (max 5 images) */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm text-mist-dim">Product images</label>
          <span className="text-xs text-mist-dim">
            {images.length}/{MAX_IMAGES}
          </span>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (images.length < MAX_IMAGES) setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-card px-4 py-6 text-center transition-colors ${
            dragActive ? 'border-gold bg-gold/5' : 'border-ink-line'
          } ${images.length >= MAX_IMAGES ? 'opacity-50' : ''}`}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={images.length >= MAX_IMAGES}
            onChange={(e) => {
              if (e.target.files?.length) addFiles(e.target.files);
              e.target.value = ''; // allow re-selecting the same file later
            }}
            className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <UploadCloud size={22} className="mx-auto mb-2 text-mist-dim" />
          <p className="text-xs text-mist-dim">
            {images.length >= MAX_IMAGES
              ? 'Maximum images reached'
              : 'Drag & drop images here, or click to browse'}
          </p>
          <p className="text-[11px] text-mist-dim/70 mt-1">
            Up to {MAX_IMAGES} images, JPG/PNG
          </p>
        </div>

        {errors.images && (
          <p className="text-xs text-red-400 mt-1">{errors.images.message}</p>
        )}

        {images.length > 0 && (
          <div className="grid grid-cols-5 gap-2 mt-3">
            {images.map((src, i) => (
              <div key={i} className="relative group aspect-square">
                <img
                  src={src}
                  alt={`Preview ${i + 1}`}
                  className="w-full h-full object-cover rounded-card border border-ink-line"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1.5 text-mist-dim">Category</label>
          <select
            className="w-full bg-ink border border-ink-line rounded-card px-3.5 py-2.5 text-sm focus-ring"
            {...register('category', { required: true })}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1.5 text-mist-dim">Price</label>
          <div className="flex gap-2">
            <select
              className="w-18 shrink-0 bg-ink border border-ink-line rounded-card px-2 py-2.5 text-sm focus-ring"
              {...register('price.currency', { required: true })}
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code}
                </option>
              ))}
            </select>
            <input
              type="number"
              step="0.01"
              className="w-full min-w-0 bg-ink border border-ink-line rounded-card px-3.5 py-2.5 text-sm focus-ring"
              placeholder="499"
              {...register('price.amount', {
                required: 'Price is required',
                min: { value: 0, message: "Price can't be negative" },
                valueAsNumber: true,
              })}
            />
          </div>
          {errors.price?.amount && (
            <p className="text-xs text-red-400 mt-1">
              {errors.price.amount.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1.5 text-mist-dim">
          Stock quantity
        </label>
        <input
          type="number"
          className="w-full bg-ink border border-ink-line rounded-card px-3.5 py-2.5 text-sm focus-ring"
          placeholder="50"
          {...register('stock', {
            required: 'Stock is required',
            min: { value: 0, message: "Stock can't be negative" },
            valueAsNumber: true,
          })}
        />
        {errors.stock && (
          <p className="text-xs text-red-400 mt-1">{errors.stock.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm mb-1.5 text-mist-dim">
          Description
        </label>
        <textarea
          rows={3}
          className="w-full bg-ink border border-ink-line rounded-card px-3.5 py-2.5 text-sm focus-ring resize-none"
          placeholder="Short description buyers will see"
          maxLength={500}
          {...register('description', {
            required: 'Description is required',
            minLength: { value: 50, message: 'Use at least 50 characters' },
            maxLength: {
              value: 500,
              message: 'Use no more than 500 characters',
            },
          })}
        />
        {errors.description && (
          <p className="text-xs text-red-400 mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-gold text-ink font-semibold rounded-card py-2.5 text-sm hover:bg-gold-soft transition-colors disabled:opacity-60"
      >
        {submitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
