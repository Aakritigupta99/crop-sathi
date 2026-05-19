import { useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

// Mock mandi data — in production, replace with APMC API or agmarknet scraper
const MARKET_DATA = [
  { crop: "Wheat (गेहूं)",      unit: "₹/qtl", price: 2275, prev: 2220, category: "Cereal" },
  { crop: "Rice (चावल)",        unit: "₹/qtl", price: 2183, prev: 2200, category: "Cereal" },
  { crop: "Maize (मक्का)",      unit: "₹/qtl", price: 1900, prev: 1850, category: "Cereal" },
  { crop: "Tomato (टमाटर)",     unit: "₹/kg",  price: 28,   prev: 22,   category: "Vegetable" },
  { crop: "Onion (प्याज)",      unit: "₹/kg",  price: 22,   prev: 30,   category: "Vegetable" },
  { crop: "Potato (आलू)",       unit: "₹/kg",  price: 18,   prev: 18,   category: "Vegetable" },
  { crop: "Groundnut (मूंगफली)",unit: "₹/kg",  price: 68,   prev: 65,   category: "Oilseed" },
  { crop: "Soybean (सोयाबीन)",  unit: "₹/qtl", price: 4400, prev: 4350, category: "Oilseed" },
  { crop: "Cotton (कपास)",      unit: "₹/qtl", price: 6700, prev: 6500, category: "Cash Crop" },
  { crop: "Sugarcane (गन्ना)",  unit: "₹/qtl", price: 315,  prev: 315,  category: "Cash Crop" },
  { crop: "Moong Dal (मूंग)",   unit: "₹/qtl", price: 7200, prev: 7000, category: "Pulse" },
  { crop: "Chana (चना)",        unit: "₹/qtl", price: 5400, prev: 5500, category: "Pulse" },
];

const CATEGORIES = ["All", "Cereal", "Vegetable", "Oilseed", "Cash Crop", "Pulse"];

export default function Market() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? MARKET_DATA
    : MARKET_DATA.filter((r) => r.category === activeCategory);

  const getTrend = (price: number, prev: number) => {
    const diff = price - prev;
    const pct = ((diff / prev) * 100).toFixed(1);
    if (diff > 0) return { icon: <TrendingUp className="h-4 w-4 text-green-600" />, text: `+${pct}%`, color: "text-green-600" };
    if (diff < 0) return { icon: <TrendingDown className="h-4 w-4 text-red-500" />, text: `${pct}%`, color: "text-red-500" };
    return { icon: <Minus className="h-4 w-4 text-gray-400" />, text: "0%", color: "text-gray-400" };
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-emerald-50 to-white">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-2xl font-bold">Mandi Prices</h1>
        <p className="text-sm text-muted-foreground mb-1">Today's crop rates at nearby mandis.</p>
        <p className="text-xs text-muted-foreground mb-4">
          📍 Simulated data. In production, connects to APMC / Agmarknet APIs.
        </p>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                activeCategory === cat
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-muted-foreground border-gray-200 hover:border-emerald-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <Card>
          <CardContent className="p-0 divide-y">
            {/* Header row */}
            <div className="flex items-center px-4 py-2 bg-gray-50 text-xs text-muted-foreground font-medium">
              <div className="flex-1">Crop</div>
              <div className="w-20 text-right">Unit</div>
              <div className="w-24 text-right">Price</div>
              <div className="w-16 text-right">Change</div>
            </div>

            {filtered.map((r) => {
              const trend = getTrend(r.price, r.prev);
              return (
                <div key={r.crop} className="flex items-center px-4 py-3 hover:bg-emerald-50/50 transition-colors">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{r.crop}</div>
                    <div className="text-xs text-muted-foreground">{r.category}</div>
                  </div>
                  <div className="w-20 text-right text-xs text-muted-foreground">{r.unit}</div>
                  <div className="w-24 text-right font-semibold">₹{r.price.toLocaleString("en-IN")}</div>
                  <div className={`w-16 text-right flex items-center justify-end gap-1 text-xs ${trend.color}`}>
                    {trend.icon}
                    <span>{trend.text}</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <p className="mt-4 text-xs text-muted-foreground text-center">
          Data last updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </main>
      <Footer />
    </div>
  );
}
