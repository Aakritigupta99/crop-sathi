import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Card, CardContent } from "@/components/ui/card";

export default function Composting() {
  const guidance = `🌱 AI Guidance: Composting Farm Waste\n\nTurning farm waste into compost is a simple and sustainable way to enrich your soil. Here’s how you can do it:\n\n1. **Collect Organic Waste**\n   - Use crop residues, dry leaves, animal manure, and kitchen waste.\n   - Avoid plastics, chemicals, or diseased plants.\n2. **Layer the Compost Pit/Drum**\n   - Start with a base of dry materials (straw, dry leaves).\n   - Add green materials (vegetable waste, manure).\n   - Alternate layers for balanced nutrients.\n3. **Maintain Moisture & Aeration**\n   - Keep the pile moist (like a squeezed sponge).\n   - Turn the compost every 7–10 days to allow oxygen flow.\n4. **Add Natural Boosters**\n   - Sprinkle cow dung slurry, jaggery water, or bio-culture to speed up decomposition.\n5. **Composting Time**\n   - Within **6–8 weeks**, the waste turns into dark, crumbly, earthy-smelling compost.\n\n🌾 Benefits for Farmers:\n - Improves soil fertility and water retention.\n - Reduces the need for chemical fertilizers.\n - Saves money and supports sustainable farming.\n\n📊 AI Tip: If your soil pH is slightly acidic, adding **wood ash** in small amounts during composting can balance it.`;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-emerald-50 to-white">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl font-bold mb-4">Composting Basics</h1>
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-4">
              <iframe width="100%" height="315" src="https://www.youtube.com/embed/Qxi4TMj4AGM" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 whitespace-pre-wrap">
              <div dangerouslySetInnerHTML={{ __html: guidance.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
