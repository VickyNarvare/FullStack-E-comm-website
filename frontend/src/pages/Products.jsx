import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Modal from '../components/Modal';
import ProductCard from '../components/ProductCard';
import ProductForm from '../components/ProductForm';
import Topbar from '../components/Topbar';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/product');
      setProducts(data.product?.allproducts || data.products || []);
    } catch (err) {
      toast.error('Could not load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = async (values) => {
    setSubmitting(true);
    try {
      await api.post('/product/create', values);
      await fetchProducts();
      toast.success('Product added.');
      setAddOpen(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not add product.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const id = deleting._id || deleting.id;
    try {
      await api.post(`/product/delete/${id}`);
      setProducts((prev) => prev.filter((p) => (p._id || p.id) !== id));
      toast.success('Product deleted.');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not delete product.');
    } finally {
      setDeleting(null);
    }
  };

  const handleUpdate = async (values) => {
    const id = editing._id || editing.id;
    setSubmitting(true);
    try {
      await api.patch(`/product/update/${id}`, values);
      await fetchProducts();
      toast.success('Product updated.');
      setEditing(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not update product.');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = products.filter((p) =>
    p.title?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <Topbar title="Products" productCount={products.length} />

      <div className="p-5 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center justify-center gap-2 bg-gold text-ink font-semibold rounded-card px-4 py-2.5 text-sm hover:bg-gold-soft transition-colors"
          >
            <Plus size={16} />
            Add product
          </button>
        </div>

        <div className="bg-ink-soft border border-ink-line rounded-card overflow-x-auto">
          {loading ? (
            <p className="p-6 text-sm text-mist-dim">
              Loading your products...
            </p>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm text-mist-dim">
                {query
                  ? 'No products match your search.'
                  : "You haven't listed any products yet."}
              </p>
              {!query && (
                <button
                  onClick={() => setAddOpen(true)}
                  className="mt-3 text-sm text-gold hover:underline"
                >
                  Add your first product
                </button>
              )}
            </div>
          ) : (
            <table className="w-full min-w-140">
              <thead>
                <tr className="text-left text-xs text-mist-dim border-b border-ink-line">
                  <th className="py-3 pr-4 font-medium">Product</th>
                  <th className="py-3 pr-4 font-medium">Price</th>
                  <th className="py-3 pr-4 font-medium">Stock</th>
                  <th className="py-3 pr-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <ProductCard
                    key={p._id || p.id}
                    product={p}
                    onEdit={setEditing}
                    onDelete={setDeleting}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add a product"
      >
        <ProductForm
          onSubmit={handleAdd}
          submitting={submitting}
          submitLabel="Add product"
        />
      </Modal>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edit product"
      >
        {editing && (
          <ProductForm
            key={editing._id || editing.id}
            initialValues={editing}
            onSubmit={handleUpdate}
            submitting={submitting}
            submitLabel="Save changes"
          />
        )}
      </Modal>

      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Delete product"
      >
        {deleting && (
          <div>
            <p className="text-sm text-mist-dim mb-6">
              Remove{' '}
              <span className="text-mist font-medium">{deleting.title}</span>{' '}
              from your shop? This can't be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleting(null)}
                className="flex-1 border border-ink-line rounded-card py-2.5 text-sm hover:bg-ink transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500/90 text-white rounded-card py-2.5 text-sm hover:bg-red-500 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
