import { ImageOff, Pencil, Trash2 } from 'lucide-react';

const SYMBOLS = { INR: '₹', USD: '$' };

export default function ProductCard({ product, onDelete, onEdit }) {
  const lowStock = product.stock <= 5;
  const thumbnail = product.images?.[0] || product.imageUrl;
  const symbol = SYMBOLS[product.price?.currency] || '₹';

  return (
    <tr className="border-b border-ink-line last:border-0 hover:bg-ink/40 transition-colors px-3">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-card bg-ink border border-ink-line flex items-center justify-center overflow-hidden shrink-0">
            {thumbnail ? (
              <img
                src={thumbnail}
                onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageOff size={14} className="text-mist-dim" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium">{product.title}</p>
            <p className="text-xs text-mist-dim">
              {product.category}
              {product.images?.length > 1 &&
                ` · ${product.images.length} photos`}
            </p>
          </div>
        </div>
      </td>
      <td className="py-3 pr-4 text-sm">
        {symbol}
        {Number(product.price?.amount).toLocaleString('en-IN')}
      </td>
      <td className="py-3 pr-4 text-sm">
        <span className={lowStock ? 'text-red-400' : 'text-mist'}>
          {product.stock}
        </span>
        {lowStock && (
          <span className="ml-2 text-[10px] text-red-400 border border-red-400/30 bg-red-400/10 px-1.5 py-0.5 rounded-full">
            Low
          </span>
        )}
      </td>
      <td className="py-3 pr-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(product)}
            className="p-1.5 rounded-card text-mist-dim hover:text-gold hover:bg-gold/10 transition-colors"
            title="Edit"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(product)}
            className="p-1.5 rounded-card text-mist-dim hover:text-red-400 hover:bg-red-400/10 transition-colors"
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}
