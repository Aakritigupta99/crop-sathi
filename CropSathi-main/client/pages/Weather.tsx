import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Card, CardContent } from "@/components/ui/card";

export default function Weather() {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-emerald-50 to-white">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl font-bold">7-day Weather Forecast</h1>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mt-4">
          {days.map((d,i)=> (
            <Card key={d}><CardContent className="p-4 text-center">
              <div className="font-semibold">{d}</div>
              <div className="mt-2 text-3xl">{i%2?"☁️":"🌧️"}</div>
              <div className="mt-2 text-sm text-muted-foreground">{i%2?"31°C":"28°C"}</div>
              <div className="mt-1 text-xs">Wind {10+i} km/h</div>
            </CardContent></Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
