import { Logo } from "./Logo";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t bg-gradient-to-b from-white to-emerald-50/60 mt-12">
      <div className="container mx-auto py-10 grid gap-6 md:grid-cols-3">
        <div>
          <Logo />
          <p className="mt-3 text-sm text-muted-foreground max-w-sm">
            CropSathi – AI-driven farming assistant for every farmer.
          </p>
        </div>
        <div className="text-sm">
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link className="hover:text-emerald-700" to="/">Home</Link></li>
            <li><Link className="hover:text-emerald-700" to="/knowledge">Knowledge Hub</Link></li>
            <li><Link className="hover:text-emerald-700" to="/chat">AI Chat</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <h4 className="font-semibold mb-3">Legal</h4>
          <ul className="space-y-2">
            <li><Link className="hover:text-emerald-700" to="/about">About</Link></li>
            <li><Link className="hover:text-emerald-700" to="/contact">Contact</Link></li>
            <li><Link className="hover:text-emerald-700" to="/privacy">Privacy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} CropSathi</div>
    </footer>
  );
}
