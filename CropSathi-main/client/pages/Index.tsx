import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Bot, CloudSun, Languages, Leaf, Link2, Microscope, Sprout, Upload, Waves, BarChart3, ShieldCheck } from "lucide-react";

const heroImage = "https://cdn.builder.io/api/v1/image/assets%2Fb6ec294310c24f07b6886375a5e55d0b%2Fd6984162e4c443fc8718d23609843158?format=webp&width=800";

function HeroIllustration() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <img src={heroImage} alt="Farmer in field" className="w-full rounded-2xl shadow-lg object-cover max-h-96" />
    </div>
  );
}

const features = [
  { icon: Sprout, title: "Smart Crop Recommendation", desc: "Choose the best crops using soil, weather and market data." },
  { icon: Microscope, title: "Soil Health & Nutrients", desc: "Satellite/IoT powered soil insights and tips." },
  { icon: CloudSun, title: "Hyper-local Weather", desc: "7-day forecasts for your village." },
  { icon: Upload, title: "Plant Disease Detection", desc: "Upload or capture leaf photos for instant diagnosis." },
  { icon: BarChart3, title: "Market Price Trends", desc: "Nearby mandi rates and demand trends." },
  { icon: Bot, title: "AI Chat + Voice", desc: "Ask in your language. Get clear, actionable advice." },
  { icon: Link2, title: "Offline Support", desc: "Works in low connectivity regions." },
  { icon: Languages, title: "Multilingual", desc: "Hindi, English, Telugu and more." },
];

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('sk_user') || 'null');
      if (user) navigate('/dashboard');
    } catch {}
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-emerald-50 to-white">
      <Header />
      <main>
        <section className="container mx-auto px-4 pt-12 pb-8 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-medium mb-4">
              <ShieldCheck className="h-4 w-4" /> Trusted. Local. Smart.
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              CropSathi – AI-driven farming assistant
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-prose">
              Know your soil, track the weather, detect crop diseases early, and grow smarter with CropSathi.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button asChild className="h-12 px-6 text-base bg-gradient-to-r from-emerald-600 to-lime-600">
                <Link to="/get-started">Get Started</Link>
              </Button>
              <Button asChild variant="outline" className="h-12 px-6 text-base">
                <Link to="/login">Login</Link>
              </Button>
            </div>
          </div>
          <div>
            <HeroIllustration />
          </div>
        </section>

        <section className="container mx-auto px-4 py-10">
          <h2 className="text-2xl font-bold mb-6">Built for Indian farmers</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f) => (
              <Card key={f.title} className="hover:shadow-lg transition-shadow">
                <CardContent className="flex items-start gap-3 p-5">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="font-semibold">{f.title}</div>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-10">
          <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-lime-600 p-6 text-white grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-2xl font-bold">One app. Everything you need.</h3>
              <p className="opacity-90 mt-2">Recommendations, weather, market prices, disease detection and more – all in your language.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="secondary" className="bg-white text-emerald-700 hover:bg-white/90">
                <Link to="/dashboard">Open Dashboard</Link>
              </Button>
              <Button asChild variant="secondary" className="bg-white text-emerald-700 hover:bg-white/90">
                <Link to="/chat">Ask CropSathi</Link>
              </Button>
              <Button asChild variant="secondary" className="bg-white text-emerald-700 hover:bg-white/90">
                <Link to="/knowledge">Knowledge Hub</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
