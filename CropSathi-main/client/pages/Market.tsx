import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Card, CardContent } from "@/components/ui/card";

const rows = [
  { crop: 'Wheat', unit: '₹/qtl', price: 2220 },
  { crop: 'Tomato', unit: '₹/kg', price: 28 },
  { crop: 'Onion', unit: '₹/kg', price: 22 },
  { crop: 'Groundnut', unit: '₹/kg', price: 68 },
];

export default function Market() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-emerald-50 to-white">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-2xl font-bold">Nearby Mandi Prices</h1>
        <Card className="mt-4">
          <CardContent className="p-0 divide-y">
            {rows.map((r)=> (
              <div key={r.crop} className="flex items-center justify-between p-4">
                <div className="font-medium">{r.crop}</div>
                <div className="text-sm text-muted-foreground">{r.unit}</div>
                <div className="font-semibold">₹{r.price}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
