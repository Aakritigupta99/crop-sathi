import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sprout, CloudRain, BarChart3, Camera, Bot, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { ActivityLogger } from "@/components/site/ActivityLogger";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Dashboard() {
  const [userProfile, setUserProfile] = useState<any>(() => {
    try {
      return JSON.parse(localStorage.getItem("sk_user") || '{"name":"Ramesh"}');
    } catch {
      return { name: "Ramesh" };
    }
  });

  // language select for dashboard (moved from header)
  const [lang, setLang] = useState<string>(
    () => localStorage.getItem("sk_lang") || "en",
  );
  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem("sk_lang", lang);
  }, [lang]);

  const [showActivitiesModal, setShowActivitiesModal] = useState(false);
  const [activityItems, setActivityItems] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("sk_activities") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const onStorage = () =>
      setActivityItems(
        JSON.parse(localStorage.getItem("sk_activities") || "[]"),
      );
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // edit modal state for recommended crops / profile
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<any>(() => ({
    ph: userProfile?.ph ?? "",
    lat: userProfile?.lat ?? "",
    lon: userProfile?.lon ?? "",
    experience: userProfile?.experience ?? "",
    farmSize: userProfile?.farmSize ?? "",
    soilType: userProfile?.soilType ?? "loam",
  }));

  useEffect(() => {
    setEditForm({
      ph: userProfile?.ph ?? "",
      lat: userProfile?.lat ?? "",
      lon: userProfile?.lon ?? "",
      experience: userProfile?.experience ?? "",
      farmSize: userProfile?.farmSize ?? "",
      soilType: userProfile?.soilType ?? "loam",
    });
  }, [userProfile]);

  // Expense tracker state
  const [expenses, setExpenses] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("sk_expenses") || "[]");
    } catch {
      return [];
    }
  });
  const [expenseType, setExpenseType] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expectedYield, setExpectedYield] = useState(1000); // default units
  const [expectedPrice, setExpectedPrice] = useState(28); // default price per unit

  useEffect(() => {
    localStorage.setItem("sk_expenses", JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = () => {
    const amt = Number(expenseAmount);
    if (!expenseType || !amt || amt <= 0)
      return alert("Enter valid expense and amount");
    const it = { id: Date.now(), type: expenseType, amount: amt };
    setExpenses((s) => [it, ...s]);
    setExpenseType("");
    setExpenseAmount("");
  };

  const totalExpenses = useMemo(
    () => expenses.reduce((a, b) => a + (b.amount || 0), 0),
    [expenses],
  );
  const estimatedRevenue = expectedYield * expectedPrice;
  const estimatedProfit = estimatedRevenue - totalExpenses;
  const expensePct =
    estimatedRevenue > 0
      ? Math.min(100, Math.round((totalExpenses / estimatedRevenue) * 100))
      : 0;

  // Community forum (mock)
  const threads = [
    {
      id: 1,
      title: "Best organic pesticides for tomato",
      author: "Suman",
      time: "2h",
      excerpt: "Try neem-based spray and maintain drainage.",
    },
    {
      id: 2,
      title: "Drip irrigation setup tips",
      author: "Ravi",
      time: "1d",
      excerpt: "Use filter and check pressure regularly.",
    },
    {
      id: 3,
      title: "Storage methods for onions",
      author: "Meera",
      time: "3d",
      excerpt: "Dry well and store in ventilated area.",
    },
  ];

  const [showLeftNav, setShowLeftNav] = useState(false);

  // handle toggling explanation panels for crops (use DOM events to avoid heavy state)
  useEffect(() => {
    const onToggle = (e: any) => {
      const key = e.detail as string;
      const el = document.getElementById(`explain-${key}`);
      if (!el) return;
      if (el.classList.contains("hidden")) {
        el.classList.remove("hidden");
      } else {
        el.classList.add("hidden");
      }
    };
    window.addEventListener("toggleCropExplain", onToggle as EventListener);
    return () =>
      window.removeEventListener(
        "toggleCropExplain",
        onToggle as EventListener,
      );
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-emerald-50 to-white">
      <Header />
      <main className="relative container mx-auto px-4 py-6 max-w-6xl">
        <div className="my-4 rounded-xl bg-amber-50 border border-amber-200 p-4 flex items-center gap-3">
          <Bell className="text-amber-600" />
          <p className="text-sm">
            <span className="font-semibold">Alert:</span> Rain expected tomorrow
            – delay irrigation.
          </p>
        </div>

        <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
          <h1 className="text-2xl font-bold">
            Hello, {userProfile.name}! 🌾 Here’s your farming update for today.
          </h1>
          <div className="mt-3 sm:mt-0 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Language
              </span>
              <div>
                <Select value={lang} onValueChange={setLang}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">हिंदी</SelectItem>
                    <SelectItem value="te">తెలుగు</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 items-start auto-rows-min">
          {/* Recommended Crops (moved above Field Activity) */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Recommended Crops</div>
                  <p className="text-sm text-muted-foreground">
                    Based on your soil, weather & market
                  </p>
                </div>
                <Sprout className="text-emerald-600" />
              </div>

              {/* pH alert: if user's ph > 7.5 show recommendation */}
              {userProfile?.ph && Number(userProfile.ph) > 7.5 && (
                <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm">
                  <div className="font-semibold">Soil pH alert</div>
                  <div className="mt-1">
                    Your soil pH is {Number(userProfile.ph)} — consider adding
                    organic matter (compost, farmyard manure, biochar) to
                    improve buffering capacity and soil health.
                  </div>
                </div>
              )}

              <div className="mt-4">
                {/* crop list with explain toggles */}
                {[
                  {
                    key: "rice",
                    en: "Rice",
                    hi: "धान",
                    explain:
                      "Why: Rainfed paddy thrives in September; sowing is common in June–July with harvesting around October–November. Supporting data: Records show paddy cultivation is up by 4% this year and already at 100% of the normal sowing area — The Hindu Business Line, Moneycontrol. How it fits: Loamy soil and slightly acidic pH of 6 are generally suitable for paddy.",
                  },
                  {
                    key: "cereals",
                    en: "Coarse Cereals & Pulses (e.g., Maize, Soybean)",
                    hi: "मक्का, सोयाबीन",
                    explain:
                      "Why: These crops see a rise in sown area during the Kharif season, especially with favorable September rainfall — The Hindu Business Line. Benefit: Great for crop diversification and improving soil health through rotation.",
                  },
                  {
                    key: "horti",
                    en: "Horticultural Crops (e.g., Cabbage)",
                    hi: "पत्ता गोभी",
                    explain:
                      "Why: In West Bengal, cabbage is typically grown from September to March. The ideal soil pH range (6.0–6.2) aligns with your field — ResearchGate. Plus: Loamy soil supports such vegetables well, and there's good local market demand.",
                  },
                ].map((crop) => (
                  <div key={crop.key} className="mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-800">
                        {crop.en} •{" "}
                        <span className="text-emerald-700">{crop.hi}</span>
                      </span>
                      <button
                        className="ml-2 px-2 py-1 border rounded bg-white text-sm"
                        onClick={() => {
                          const ev = new CustomEvent("toggleCropExplain", {
                            detail: crop.key,
                          });
                          window.dispatchEvent(ev);
                        }}
                      >
                        ?
                      </button>
                    </div>
                    <div
                      id={`explain-${crop.key}`}
                      className="mt-2 text-sm text-muted-foreground hidden"
                    >
                      {crop.explain}
                    </div>
                  </div>
                ))}

                <div className="mt-2 text-xs text-muted-foreground">
                  See more →{" "}
                  <Link to="/crops" className="text-emerald-700">
                    Crops
                  </Link>
                </div>

                <div className="mt-3">
                  <Button asChild size="sm" className="ml-2">
                    <Link to="/chat?topic=crops">AI Suggest ?</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Field Activity */}
          <Card>
            <CardContent className="p-5">
              <div className="font-semibold">Field Activity</div>
              <p className="text-sm text-muted-foreground">
                Log daily activities on your field
              </p>
              <ActivityLogger showHistory={false} />
              <div className="mt-3 flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => {
                    setActivityItems(
                      JSON.parse(localStorage.getItem("sk_activities") || "[]"),
                    );
                    setShowActivitiesModal(true);
                  }}
                >
                  Show Activities
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    if (confirm("Clear all activities?")) {
                      localStorage.removeItem("sk_activities");
                      setActivityItems([]);
                    }
                  }}
                >
                  Clear Activities
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Weather */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Weather Forecast</div>
                  <p className="text-sm text-muted-foreground">Next 7 days</p>
                </div>
                <CloudRain className="text-emerald-600" />
              </div>
              <div className="mt-4 grid grid-cols-4 sm:grid-cols-7 gap-2 text-center text-xs">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (d, i) => (
                    <div key={d} className="rounded-md p-2 border">
                      <div className="font-semibold">{d}</div>
                      <div className="mt-1">{i % 2 ? "☁️ 31°" : "🌧️ 28°"}</div>
                    </div>
                  ),
                )}
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                See more →{" "}
                <Link to="/weather" className="text-emerald-700">
                  Weather
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Market Prices */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Market Prices</div>
                  <p className="text-sm text-muted-foreground">
                    Nearby mandi rates
                  </p>
                </div>
                <BarChart3 className="text-emerald-600" />
              </div>
              <div className="mt-4 space-y-2 text-sm">
                {[
                  ["Wheat", "₹2220/qtl"],
                  ["Tomato", "₹28/kg"],
                  ["Onion", "₹22/kg"],
                ].map(([n, p]) => (
                  <div
                    key={n}
                    className="flex justify-between border rounded-md p-2"
                  >
                    <span>{n}</span>
                    <span className="font-semibold">{p}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                See more →{" "}
                <Link to="/market" className="text-emerald-700">
                  Market
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Government Schemes (quick view) */}
          <Card className="min-h-0 flex flex-col overflow-hidden">
            <CardContent className="p-5 flex-1">
              <div className="font-semibold mb-2">Government Schemes</div>
              <p className="text-sm text-muted-foreground mb-3">
                Apply for key schemes
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-emerald-50 rounded-md p-3">
                  <div>
                    <div className="font-semibold">Kisan Credit Card</div>
                    <div className="text-sm text-muted-foreground">
                      Affordable credit for production
                    </div>
                  </div>
                  <Button
                    onClick={() =>
                      window.open(
                        "https://www.myscheme.gov.in/schemes/kcc",
                        "_blank",
                      )
                    }
                    className="h-9"
                  >
                    Apply Now
                  </Button>
                </div>
                <div className="flex items-center justify-between bg-emerald-50 rounded-md p-3">
                  <div>
                    <div className="font-semibold">PM-Kisan Yojana</div>
                    <div className="text-sm text-muted-foreground">
                      Income support for small farmers
                    </div>
                  </div>
                  <Button
                    onClick={() =>
                      window.open(
                        "https://pmkisan.gov.in/homenew.aspx?aspxerrorpath=/BeneficiaryStatus_New.aspx",
                        "_blank",
                      )
                    }
                    className="h-9"
                  >
                    Apply Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Diagnose */}
          <Card>
            <CardContent className="p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2 font-semibold">
                <Camera /> Diagnose Crop
              </div>
              <p className="text-sm text-muted-foreground">
                Upload leaf/crop photo to check diseases
              </p>
              <Button asChild>
                <Link to="/diagnose">Open</Link>
              </Button>
            </CardContent>
          </Card>

          {/* AI Chat */}
          <Card>
            <CardContent className="p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2 font-semibold">
                <Bot /> Ask CropSathi
              </div>
              <p className="text-sm text-muted-foreground">
                Chat in your language with voice
              </p>
              <Button asChild>
                <Link to="/chat?fresh=true">Start Chat</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Expense Tracker (shortcut) */}
          <Card>
            <CardContent className="p-5 flex flex-col gap-3">
              <div className="font-semibold">Expense Tracker</div>
              <p className="text-sm text-muted-foreground">
                Quick access to full tracker
              </p>
              <Button asChild>
                <Link to="/expense-tracker">Open</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Green Points */}
          <Card>
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <div className="font-semibold">Green Points</div>
                <p className="text-sm text-muted-foreground">
                  Rewards for sustainable practices
                </p>
              </div>
              <div className="text-2xl font-bold text-emerald-700">120</div>
            </CardContent>
          </Card>

          {/* Analytics */}
          <Card>
            <CardContent className="p-5">
              <div className="font-semibold mb-2">Analytics</div>
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="border rounded-md p-2">
                  <div className="text-xs text-muted-foreground">Yield</div>
                  <div className="font-semibold">+12%</div>
                </div>
                <div className="border rounded-md p-2">
                  <div className="text-xs text-muted-foreground">Profit</div>
                  <div className="font-semibold">₹18k</div>
                </div>
                <div className="border rounded-md p-2">
                  <div className="text-xs text-muted-foreground">
                    Soil score
                  </div>
                  <div className="font-semibold">78</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Knowledge Hub (moved below Analytics) */}
          <Card className="min-h-0 flex flex-col overflow-hidden">
            <CardContent className="p-5 flex-1">
              <div className="font-semibold mb-2">Knowledge Hub</div>
              <p className="text-sm text-muted-foreground mb-3">
                Guides, videos & green points
              </p>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center justify-between bg-emerald-50 rounded-md p-3">
                  <div>
                    <div className="font-semibold">Getting Started Guides</div>
                    <div className="text-sm text-muted-foreground">
                      Short how-to articles
                    </div>
                  </div>
                  <Button asChild>
                    <Link to="/knowledge">Open</Link>
                  </Button>
                </div>
                <div className="flex items-center justify-between bg-emerald-50 rounded-md p-3">
                  <div>
                    <div className="font-semibold">Composting Tips</div>
                    <div className="text-sm text-muted-foreground">
                      Improve soil health
                    </div>
                  </div>
                  <Button asChild>
                    <Link to="/knowledge/composting">Open</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Community Forum */}
          <div className="lg:col-span-2">
            <Card className="min-h-0 flex flex-col overflow-hidden">
              <CardContent className="p-5 flex-1">
                <div className="font-semibold mb-2">Community Forum</div>
                <p className="text-sm text-muted-foreground mb-3">
                  Connect with other farmers, share tips and ask questions.
                </p>
                <div className="space-y-3">
                  {threads.map((t) => (
                    <div key={t.id} className="border rounded-md p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{t.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {t.excerpt}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {t.author} • {t.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <Button onClick={() => window.open("#/forum", "_blank")}>
                    Join Forum
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Button onClick={() => setShowEditModal(true)}>Edit Profile</Button>
        </div>

        {/* Edit Profile Modal */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setShowEditModal(false)}
            />
            <div className="bg-white rounded-md shadow-lg z-10 max-w-md w-full mx-4 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold">Edit Profile</div>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-sm text-muted-foreground"
                >
                  Close
                </button>
              </div>
              <div className="grid gap-3">
                <div>
                  <Label>PH value</Label>
                  <Input
                    value={editForm.ph}
                    onChange={(e: any) =>
                      setEditForm((s: any) => ({ ...s, ph: e.target.value }))
                    }
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <Label>Latitude</Label>
                    <Input
                      value={editForm.lat}
                      onChange={(e: any) =>
                        setEditForm((s: any) => ({ ...s, lat: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label>Longitude</Label>
                    <Input
                      value={editForm.lon}
                      onChange={(e: any) =>
                        setEditForm((s: any) => ({ ...s, lon: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <Label>Experience</Label>
                    <Input
                      value={editForm.experience}
                      onChange={(e: any) =>
                        setEditForm((s: any) => ({
                          ...s,
                          experience: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label>Farm size</Label>
                    <Input
                      value={editForm.farmSize}
                      onChange={(e: any) =>
                        setEditForm((s: any) => ({
                          ...s,
                          farmSize: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>Soil type</Label>
                  <Select
                    value={editForm.soilType}
                    onValueChange={(v) =>
                      setEditForm((s: any) => ({ ...s, soilType: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Soil" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="loam">Loam</SelectItem>
                      <SelectItem value="sandy">Sandy</SelectItem>
                      <SelectItem value="clay">Clay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    onClick={() => {
                      const updated = {
                        ...userProfile,
                        ...editForm,
                        ph: editForm.ph ? Number(editForm.ph) : null,
                      };
                      localStorage.setItem("sk_user", JSON.stringify(updated));
                      setUserProfile(updated);
                      setShowEditModal(false);
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activities Modal */}
        {showActivitiesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setShowActivitiesModal(false)}
            />
            <div className="bg-white rounded-md shadow-lg z-10 max-w-lg w-full mx-4 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold">Activities</div>
                <button
                  onClick={() => setShowActivitiesModal(false)}
                  className="text-sm text-muted-foreground"
                >
                  Close
                </button>
              </div>
              <div className="space-y-2 max-h-80 overflow-auto">
                {activityItems.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    No activities yet
                  </div>
                ) : (
                  activityItems.map((it) => (
                    <div key={it.id} className="border rounded-md p-3">
                      <div className="font-semibold">{it.activity}</div>
                      {it.notes && (
                        <div className="text-sm text-muted-foreground">
                          {it.notes}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        {new Date(it.date).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
