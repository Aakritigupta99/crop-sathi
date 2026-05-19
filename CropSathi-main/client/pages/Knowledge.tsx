import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Card, CardContent } from "@/components/ui/card";

const guides = [
  { title: 'Composting Basics', desc: 'Turn farm waste into nutrient-rich compost.' },
  { title: 'Natural Pest Control', desc: 'Use neem oil and traps effectively.' },
  { title: 'Water-Smart Irrigation', desc: 'Save water with drip and schedule.' },
  { title: 'Soil Health 101', desc: 'Improve soil organic matter and microbes.' },
];

export default function Knowledge() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-emerald-50 to-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Knowledge Hub</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {guides.map((g) => (
            <Card key={g.title}>
              <CardContent className="p-5">
                <div className="font-semibold">{g.title}</div>
                <p className="text-sm text-muted-foreground mt-1">{g.desc}</p>
                {g.title === 'Composting Basics' ? (
                  <a className="text-emerald-700 text-sm mt-3 inline-block" href="/knowledge/composting">Read guide</a>
                ) : (
                  <a className="text-emerald-700 text-sm mt-3 inline-block" href="#">Read guide</a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
