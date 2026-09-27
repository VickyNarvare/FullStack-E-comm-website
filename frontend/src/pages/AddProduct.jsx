import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import api from '../api/axios';
import ProductForm from '../components/ProductForm';
import Topbar from '../components/Topbar';

export default function AddProduct() {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleAdd = async (values) => {
    setSubmitting(true);
    try {
      await api.post('/product/create', values);
      toast.success('Product added to your shop.');
      navigate('/dashboard/products');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not add product.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Topbar title="Add product" />
      <div className="p-5 sm:p-8 max-w-xl">
        <div className="bg-ink-soft border border-ink-line rounded-card p-6">
          <ProductForm
            onSubmit={handleAdd}
            submitting={submitting}
            submitLabel="Add product"
          />
        </div>
      </div>
    </>
  );
}
