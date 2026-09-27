import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Boxes, IndianRupee, AlertTriangle, Layers } from "lucide-react";
import api from "../api/axios";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const gridRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/product");
        setProducts(data.product?.allproducts || data.products || []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loading && gridRef.current) {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }
      );
    }
  }, [loading]);

  const totalProducts = products.length;
  const totalStockValue = products.reduce(
    (sum, product) => sum + Number(product.price?.amount) * Number(product.stock),
    0
  );
  const lowStock = products.filter((p) => Number(p.stock) <= 5).length;
  const categories = new Set(products.map((p) => p.category)).size;

  return (
    <>
      <Topbar title="Overview" productCount={totalProducts} />

      <div className="p-5 sm:p-8">
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total products" value={totalProducts} icon={Boxes} accent="gold" />
          <StatCard
            label="Inventory value"
            value={`₹${totalStockValue.toLocaleString("en-IN")}`}
            icon={IndianRupee}
            accent="teal"
          />
          <StatCard label="Low stock alerts" value={lowStock} icon={AlertTriangle} accent="gold" />
          <StatCard label="Categories listed" value={categories} icon={Layers} accent="mist" />
        </div>

        <div className="bg-ink-soft border border-ink-line rounded-card p-6">
          <h3 className="text-sm font-semibold mb-1">Getting to the next tier</h3>
          <p className="text-xs text-mist-dim mb-4">
            Sellers rank up as they list more products and keep stock healthy. Add products
            regularly and restock low-inventory items to climb from Bronze toward Platinum.
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            {["Bronze", "Silver", "Gold", "Platinum"].map((tier) => (
              <span
                key={tier}
                className="px-3 py-1 rounded-full border border-ink-line text-mist-dim"
              >
                {tier}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
