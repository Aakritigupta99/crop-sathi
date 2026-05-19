import { Link, NavLink, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

function MobileMenu({ user, logout }: { user: any; logout: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open menu"
        className="p-2 rounded-md border bg-white"
      >
        <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect y="1" width="20" height="2" rx="1" fill="#065F46" />
          <rect y="6" width="20" height="2" rx="1" fill="#065F46" />
          <rect y="11" width="20" height="2" rx="1" fill="#065F46" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-12 right-0 w-56 bg-white border rounded-md shadow-lg p-3 z-50">
          <div className="flex flex-col">
            <Link to="/dashboard" onClick={() => setOpen(false)} className="px-2 py-2 rounded hover:bg-emerald-50">Dashboard</Link>
            <Link to="/chat" onClick={() => setOpen(false)} className="px-2 py-2 rounded hover:bg-emerald-50">AI Chat</Link>
            <Link to="/expense-tracker" onClick={() => setOpen(false)} className="px-2 py-2 rounded hover:bg-emerald-50">Expense Tracker</Link>
            <Link to="/schemes" onClick={() => setOpen(false)} className="px-2 py-2 rounded hover:bg-emerald-50">Government Schemes</Link>
            <button onClick={() => { setOpen(false); logout(); }} className="text-left px-2 py-2 rounded hover:bg-emerald-50">Logout</button>
          </div>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const location = useLocation();
  const [user, setUser] = useState<any>(() => {
    try {
      return JSON.parse(localStorage.getItem("sk_user") || "null");
    } catch { return null }
  });
  const [showLeftNav, setShowLeftNav] = useState(false);

  // Re-read user whenever location changes so header reflects login/logout in same tab
  useEffect(() => {
    try {
      setUser(JSON.parse(localStorage.getItem("sk_user") || "null"));
    } catch {
      setUser(null);
    }
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const onStorage = () => setUser(JSON.parse(localStorage.getItem("sk_user") || "null"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const logout = () => {
    localStorage.removeItem("sk_user");
    setUser(null);
    // also remove partial user
    localStorage.removeItem("sk_partial_user");
    window.location.href = "/";
  };

  const hideLogin = location.pathname.startsWith('/get-started') || location.pathname.startsWith('/profile') || location.pathname.startsWith('/login');

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto h-16 px-4">
        <div className="grid grid-cols-[auto_1fr_auto] items-center h-16">
          {/* left: menu */}
          <div className="flex items-center justify-start">
            <div className="relative">
              <button onClick={() => setShowLeftNav(s => !s)} className="p-2 rounded-md bg-white border">
                <Menu className="w-5 h-5 text-emerald-700" />
              </button>
              {showLeftNav && (
                <div className="absolute left-0 top-12 w-48 bg-white border rounded-md shadow-lg p-2 z-50">
                  <nav className="flex flex-col gap-2 text-sm">
                    <NavLink to="/dashboard" onClick={() => setShowLeftNav(false)} className={({isActive}) => isActive? 'px-2 py-2 rounded bg-emerald-50 font-semibold':'px-2 py-2 rounded hover:bg-emerald-50'}>Dashboard</NavLink>
                    <NavLink to="/chat" onClick={() => setShowLeftNav(false)} className={({isActive}) => isActive? 'px-2 py-2 rounded bg-emerald-50 font-semibold':'px-2 py-2 rounded hover:bg-emerald-50'}>AI Chat</NavLink>
                    <NavLink to="/expense-tracker" onClick={() => setShowLeftNav(false)} className={({isActive}) => isActive? 'px-2 py-2 rounded bg-emerald-50 font-semibold':'px-2 py-2 rounded hover:bg-emerald-50'}>Expense Tracker</NavLink>
                    <NavLink to="/schemes" onClick={() => setShowLeftNav(false)} className={({isActive}) => isActive? 'px-2 py-2 rounded bg-emerald-50 font-semibold':'px-2 py-2 rounded hover:bg-emerald-50'}>Government Schemes</NavLink>
                    <NavLink to="/crops" onClick={() => setShowLeftNav(false)} className={({isActive}) => isActive? 'px-2 py-2 rounded bg-emerald-50 font-semibold':'px-2 py-2 rounded hover:bg-emerald-50'}>Crops</NavLink>
                  </nav>
                </div>
              )}
            </div>
          </div>

          {/* center: logo/title */}
          <div className="flex items-center justify-center justify-self-center">
            <Link to="/" className="flex items-center gap-3">
              <Logo />
            </Link>
          </div>

          {/* right: nav / auth */}
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-3">
              <nav className="hidden md:flex items-center gap-6 text-sm">
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? "text-emerald-700 font-semibold" : "text-foreground/70 hover:text-foreground"}>Dashboard</NavLink>
                <NavLink to="/chat" className={({ isActive }) => isActive ? "text-emerald-700 font-semibold" : "text-foreground/70 hover:text-foreground"}>AI Chat</NavLink>
                <NavLink to="/expense-tracker" className={({ isActive }) => isActive ? "text-emerald-700 font-semibold" : "text-foreground/70 hover:text-foreground"}>Expense Tracker</NavLink>
                <NavLink to="/schemes" className={({ isActive }) => isActive ? "text-emerald-700 font-semibold" : "text-foreground/70 hover:text-foreground"}>Government Schemes</NavLink>
              </nav>

              {user ? (
                <div className="flex items-center gap-3">
                  <Button onClick={logout} variant="ghost" className="border">Logout</Button>
                </div>
              ) : (
                !hideLogin && (
                  <Button asChild className="hidden sm:inline-flex bg-gradient-to-r from-emerald-600 to-lime-600">
                    <Link to="/login">Login</Link>
                  </Button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
