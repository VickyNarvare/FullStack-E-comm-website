import { forwardRef } from "react";

const StatCard = forwardRef(({ label, value, icon: Icon, accent = "gold" }, ref) => {
  const accentMap = {
    gold: "text-gold bg-gold/10 border-gold/20",
    teal: "text-teal bg-teal/10 border-teal/20",
    mist: "text-mist bg-mist/10 border-mist/20",
  };

  return (
    <div
      ref={ref}
      className="bg-ink-soft border border-ink-line rounded-card p-5 flex items-center gap-4"
    >
      <div className={`w-11 h-11 rounded-card border flex items-center justify-center ${accentMap[accent]}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-semibold font-display leading-none">{value}</p>
        <p className="text-xs text-mist-dim mt-1.5">{label}</p>
      </div>
    </div>
  );
});

export default StatCard;
