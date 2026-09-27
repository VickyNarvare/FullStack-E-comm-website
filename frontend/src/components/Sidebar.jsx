import { Boxes, LayoutGrid, LogOut, PackagePlus } from 'lucide-react';
import { NavLink } from 'react-router';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: LayoutGrid, end: true },
  { to: '/dashboard/products', label: 'Products', icon: Boxes },
  { to: '/dashboard/add-product', label: 'Add product', icon: PackagePlus },
];

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-ink-line bg-ink-soft">
      <div className="px-6 py-6 text-xl font-display font-bold tracking-tight">
        Vendr<span className="text-gold">.</span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-card text-sm transition-colors ${
                isActive
                  ? 'bg-gold/10 text-gold border border-gold/30'
                  : 'text-mist-dim hover:text-mist hover:bg-ink'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={logout}
        className="mx-3 mb-6 flex items-center gap-3 px-3 py-2.5 rounded-card text-sm text-mist-dim hover:text-red-400 hover:bg-ink transition-colors"
      >
        <LogOut size={17} />
        Log out
      </button>
    </aside>
  );
}
