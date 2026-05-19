import { useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sprout, Loader2, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";

interface CropResult {
  recommended_crop: string;
  confidence: number;
  emoji: string;
  season: string;
  water_requirement: string;
  days_to_harvest: number;
  estimated_profit_per_acre: number;
  top_3: { crop: string; confidence: number; emoji: string }[];
  tip: string;
}

const FIELDS = [
  { name: "N",           label: "Nitrogen (N)",       placeholder: "e.g. 90",  unit: "kg/ha", tip: "Found on fertilizer bags as N value" },
  { name: "P",           label: "Phosphorus (P)",      placeholder: "e.g. 42",  unit: "kg/ha", tip: "Found on fertilizer bags as P value" },
  { name: "K",           label: "Potassium (K)",       placeholder: "e.g. 43",  unit: "kg/ha", tip: "Found on fertilizer bags as K value" },
  { name: "temperature", label: "Temperature",         placeholder: "e.g. 25",  unit: "°C",    tip: "Current average temperature in your area" },
  { name: "humidity",    label: "Humidity",            placeholder: "e.g. 80",  unit: "%",     tip: "Average relative humidity in your area" },
  { name: "ph",          label: "Soil pH",             placeholder: "e.g. 6.5", unit: "pH",    tip: "6-7 is neutral/ideal. Get soil tested at local Krishi Kendra" },
  { name: "rainfall",    label: "Annual Rainfall",     placeholder: "e.g. 200", unit: "mm",    tip: "Average yearly rainfall. Check local records or weather app" },
];

// Default values for quick demo
const DEMO_VALUES: Record<string, string> = {
  N: "90", P: "42", K: "43", temperature: "25", humidity: "80", ph: "6.5", rainfall: "200"
};

export default function Crops() {
  const [form, setForm] = useState<Record<string, string>>({});
  const [result, setResult] = useState<CropResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(true);

  const handleChange = (name: string, value: string) => {
    setForm((f) => ({ ...f, [name]: value }));
  };

  const loadDemo = () => {
    setForm(DEMO_VALUES);
  };

  const handleSubmit = async () => {
    // Validate all fields filled
    for (const f of FIELDS) {
      if (!form[f.name] || form[f.name].trim() === "") {
        setError(`Please enter a value for ${f.label}`);
        return;
      }
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload: Record<string, number> = {};
      for (const f of FIELDS) {
        payload[f.name] = parseFloat(form[f.name]);
      }

      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to get recommendation");
      }

      const data: CropResult = await res.json();
      setResult(data);
      setShowForm(false);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Is the ML server running?");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-emerald-50 to-white">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-2">
          <Sprout className="h-7 w-7 text-emerald-600" />
          <h1 className="text-2xl font-bold">AI Crop Recommendation</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Enter your soil and climate data to get the best crop recommendation powered by our ML model.
        </p>

        {/* Input Form */}
        {showForm && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">Enter Soil & Weather Data</h2>
                <Button variant="outline" size="sm" onClick={loadDemo}>
                  Load Sample Data
                </Button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {FIELDS.map((f) => (
                  <div key={f.name}>
                    <Label className="mb-1 block">
                      {f.label}
                      <span className="ml-1 text-xs text-muted-foreground">({f.unit})</span>
                    </Label>
                    <Input
                      type="number"
                      step="any"
                      placeholder={f.placeholder}
                      value={form[f.name] || ""}
                      onChange={(e) => handleChange(f.name, e.target.value)}
                      className="h-11"
                    />
                    <p className="text-xs text-muted-foreground mt-1">{f.tip}</p>
                  </div>
                ))}
              </div>

              {error && (
                <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 rounded-lg p-3 text-sm">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <Button
                className="mt-6 w-full h-12 text-base bg-gradient-to-r from-emerald-600 to-lime-600"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing your soil data...
                  </>
                ) : (
                  "🌾 Get Crop Recommendation"
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Result */}
        {result && (
          <div className="space-y-4">
            {/* Main recommendation */}
            <Card className="border-2 border-emerald-300 bg-emerald-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-emerald-700 text-sm font-medium mb-3">
                  <Sprout className="h-4 w-4" /> AI Recommendation
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-6xl">{result.emoji}</span>
                  <div>
                    <h2 className="text-3xl font-bold capitalize text-emerald-800">
                      {result.recommended_crop}
                    </h2>
                    <p className="text-emerald-600 font-medium mt-1">
                      {result.confidence}% confidence
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Details grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-xs text-muted-foreground mb-1">Best Season</div>
                  <div className="text-lg font-semibold">🗓️ {result.season}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-xs text-muted-foreground mb-1">Water Requirement</div>
                  <div className="text-lg font-semibold">💧 {result.water_requirement}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-xs text-muted-foreground mb-1">Days to Harvest</div>
                  <div className="text-lg font-semibold">⏱️ {result.days_to_harvest} days</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-xs text-muted-foreground mb-1">Est. Profit / Acre</div>
                  <div className="text-lg font-semibold text-green-700">
                    💰 ₹{result.estimated_profit_per_acre.toLocaleString("en-IN")}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Tip */}
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-4">
                <div className="text-sm font-medium text-amber-800 mb-1">💡 AI Tip</div>
                <p className="text-sm text-amber-900">{result.tip}</p>
              </CardContent>
            </Card>

            {/* Top 3 alternatives */}
            <Card>
              <CardContent className="p-4">
                <div className="font-semibold mb-3">🏆 Top 3 Recommendations</div>
                <div className="space-y-3">
                  {result.top_3.map((c, i) => (
                    <div key={c.crop} className="flex items-center gap-3">
                      <span className="text-2xl">{c.emoji}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium capitalize">{c.crop}</span>
                          <span className="text-sm text-muted-foreground">{c.confidence}%</span>
                        </div>
                        <div className="mt-1 h-2 rounded-full bg-gray-100">
                          <div
                            className="h-2 rounded-full bg-emerald-500"
                            style={{ width: `${c.confidence}%` }}
                          />
                        </div>
                      </div>
                      {i === 0 && (
                        <span className="text-xs bg-emerald-100 text-emerald-700 rounded-full px-2 py-0.5">
                          Best
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button onClick={reset} variant="outline" className="flex-1">
                ← Try Different Values
              </Button>
              <Button
                className="flex-1 bg-emerald-600"
                onClick={() => window.location.href = "/chat"}
              >
                Ask CropSathi More →
              </Button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
