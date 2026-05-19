import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Card, CardContent } from "@/components/ui/card";

const recs = [
  { name: 'Moong (मूंग)', reason: 'Good soil moisture, strong market demand', points: 20 },
  { name: 'Groundnut', reason: 'Sandy loam soil and rising prices', points: 15 },
  { name: 'Millet (बाजरा)', reason: 'Low rainfall week ahead', points: 10 },
];

export default function Crops() {
  const total = recs.reduce((a,b)=>a+b.points,0);
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-emerald-50 to-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Smart Crop Recommendations</h1>
        <p className="text-sm text-muted-foreground">Based on soil, weather and market trends.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {recs.map((c) => (
            <Card key={c.name}>
              <CardContent className="p-5">
                <div className="font-semibold">{c.name}</div>
                <p className="text-sm text-muted-foreground">{c.reason}</p>
                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs">Green Points +{c.points}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-6 text-sm">Sustainable actions earned you <span className="font-semibold">{total} Green Points</span> this week.</div>
      </main>
      <Footer />
    </div>
  );
}
