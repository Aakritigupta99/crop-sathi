import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";

const providedImageUrl = "https://cdn.builder.io/api/v1/image/assets%2Fb6ec294310c24f07b6886375a5e55d0b%2F7e1a560ac0a342d185475edeeb31ff01?format=webp&width=800";

export default function Diagnose() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(() => providedImageUrl);
  const [diagnosis, setDiagnosis] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-emerald-50 to-white">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">Diagnose Crop</h1>
            <p className="text-sm text-muted-foreground">Upload or capture a photo of leaves/crop to detect diseases.</p>
            <div className="border rounded-xl p-6 text-center">
              {preview ? (
                <img src={preview} alt="preview" className="mx-auto max-h-72 object-contain" />
              ) : (
                <p className="text-muted-foreground">No image selected</p>
              )}
            </div>

            <div className="flex gap-3">
              <Button onClick={() => fileRef.current?.click()} className="bg-gradient-to-r from-emerald-600 to-lime-600">Upload Image</Button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  const url = URL.createObjectURL(f);
                  setPreview(url);
                  setDiagnosis(null);
                }
              }} />
              <Button variant="outline">Capture</Button>
              <Button onClick={() => {
                if (!preview) return window.alert('Please upload a photo first');
                // Simulate AI analysis and return provided diagnosis
                const result = `🟢 **AI Diagnosis:**\n\nYour crop leaves are showing symptoms of **Leaf Blight** – brown, irregular patches that spread from the edges of the leaves.\n\n🌱 **Probable Cause:**\n\n- Caused by fungal or bacterial infection due to excess moisture and humidity.\n- It spreads quickly if infected leaves remain on the plant.\n\n💡 **Recommended Action:**\n\n1. Remove and destroy the infected leaves to stop further spread.\n2. Avoid overhead watering; keep leaves as dry as possible.\n3. For control, spray a mild fungicide such as **Mancozeb** or **Copper Oxychloride** (consult your local agricultural officer for exact dosage).\n4. Use disease-free seeds and resistant crop varieties in the future.\n\n📊 **AI Confidence:** 82% (Leaf Blight)\n\n🕒 **Best Time to Spray:** Early morning or late evening to avoid leaf burn.`;
                setDiagnosis(result);
              }} className="bg-emerald-600 text-white">Analyze</Button>
            </div>

            {diagnosis && (
              <div className="mt-4 p-4 bg-emerald-50 border rounded-md whitespace-pre-wrap">
                <div dangerouslySetInnerHTML={{ __html: diagnosis.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
