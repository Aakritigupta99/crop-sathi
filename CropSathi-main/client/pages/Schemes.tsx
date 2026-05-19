import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const schemes = [
  { id: 'kcc', title: 'Kisan Credit Card', desc: 'Affordable credit for farmers for crop production and allied activities.', applyUrl: 'https://www.myscheme.gov.in/schemes/kcc' },
  { id: 'pmkisan', title: 'PM-Kisan Yojana', desc: 'Income support to small and marginal farmers from government.', applyUrl: 'https://pmkisan.gov.in/homenew.aspx?aspxerrorpath=/BeneficiaryStatus_New.aspx' },
];

export default function Schemes() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-emerald-50 to-white">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl font-bold mb-4">Government Schemes & Subsidies</h1>
        <p className="text-sm text-muted-foreground mb-6">Explore active schemes and apply to get benefits.</p>
        <div className="grid gap-4">
          {schemes.map((s) => (
            <Card key={s.id}>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <div className="font-semibold">{s.title}</div>
                  <div className="text-sm text-muted-foreground">{s.desc}</div>
                </div>
                <div className="flex items-center gap-3">
                  <a className="text-emerald-700 text-sm" href="#" onClick={(e) => e.preventDefault()}>Learn</a>
                  <Button onClick={() => window.open(s.applyUrl, '_blank')} className="h-9">Apply Now</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-3">Latest Agriculture News</h2>
          <div className="space-y-3">
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold">Agrinews.in</div>
                  <div className="text-sm text-muted-foreground">Latest agriculture news and insights from Agrinews.</div>
                </div>
                <div>
                  <Button onClick={() => window.open('https://agrinews.in/', '_blank')} className="h-9">Open</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold">Down To Earth – Agriculture</div>
                  <div className="text-sm text-muted-foreground">In-depth stories on agriculture from Down To Earth.</div>
                </div>
                <div>
                  <Button onClick={() => window.open('https://www.downtoearth.org.in/agriculture', '_blank')} className="h-9">Open</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold">Economic Times – Agriculture</div>
                  <div className="text-sm text-muted-foreground">Latest agriculture business news from Economic Times.</div>
                </div>
                <div>
                  <Button onClick={() => window.open('https://economictimes.indiatimes.com/news/economy/agriculture?from=mdr', '_blank')} className="h-9">Open</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
