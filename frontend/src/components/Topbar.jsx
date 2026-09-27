import { useAuth } from "../context/AuthContext";

const TIERS = [
  { name: "Bronze", min: 0, color: "#B08D57" },
  { name: "Silver", min: 10, color: "#C0C5CE" },
  { name: "Gold", min: 25, color: "#F2B705" },
  { name: "Platinum", min: 50, color: "#2DD4BF" },
];

function getTier(productCount) {
  const current = [...TIERS].reverse().find((t) => productCount >= t.min) || TIERS[0];
  const next = TIERS[TIERS.indexOf(current) + 1];
  const progress = next
    ? Math.min(100, Math.round(((productCount - current.min) / (next.min - current.min)) * 100))
    : 100;
  return { current, next, progress };
}

export default function Topbar({ productCount = 0, title }) {
  const { seller } = useAuth();
  const { current, next, progress } = getTier(productCount);

  return (
    <header className="flex items-center justify-between gap-4 border-b border-ink-line px-5 sm:px-8 py-4">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-xs text-mist-dim">{seller?.shopName || "Your shop"}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex flex-col items-end w-36">
          <div className="flex items-center gap-1.5 text-xs mb-1">
            <span style={{ color: current.color }} className="font-semibold">
              {current.name} seller
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-ink-line overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${progress}%`, background: current.color }}
            />
          </div>
          {next && (
            <span className="text-[10px] text-mist-dim mt-1">
              {next.min - productCount > 0 ? `${next.min - productCount} more to ${next.name}` : `Ready for ${next.name}`}
            </span>
          )}
        </div>

        <div className="w-9 h-9 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-gold font-semibold text-sm">
          {(seller?.shopName || "S").charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
