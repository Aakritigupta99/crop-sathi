import { useEffect, useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const partial = JSON.parse(localStorage.getItem("sk_partial_user") || "null");
  useEffect(() => {
    if (!partial) navigate("/login");
  }, []);

  const [name, setName] = useState("");
  const [stateName, setStateName] = useState("");
  const [area, setArea] = useState("");
  const [country, setCountry] = useState("India");
  const [lat, setLat] = useState<string>(() => {
    // mock lat/lon if not provided
    return "22.5937";
  });
  const [lon, setLon] = useState<string>(() => "78.9629");
  const [ph, setPh] = useState<string>("");
  const [phMode, setPhMode] = useState<"manual" | "satellite">("manual");
  const [farmSize, setFarmSize] = useState<string>("");
  const [experience, setExperience] = useState<string>("");
  const [soilType, setSoilType] = useState<string>("loam");
  const [prevCrops, setPrevCrops] = useState<string>("");

  const fetchSatellitePh = async () => {
    try {
      // Simulate satellite lookup based on lat/lon. Real implementation would call an API.
      const latNum = Number(lat) || 22.5937;
      const lonNum = Number(lon) || 78.9629;
      // Simple deterministic pseudo-random estimate for demo
      const seed = Math.abs(Math.floor((latNum + lonNum) * 1000) % 50);
      const estimated = 5.5 + seed / 100;
      setPh(estimated.toFixed(1));
      setPhMode("satellite");
      return estimated;
    } catch (e) {
      alert("Unable to fetch satellite data");
      return null;
    }
  };

  const submit = () => {
    if (!name) return window.alert("Please enter your name");
    const profile = {
      name,
      state: stateName,
      area,
      country,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      ph: ph ? parseFloat(ph) : null,
      farmSize,
      experience,
      soilType,
      prevCrops: prevCrops
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      phone: partial?.phone,
      lang: partial?.lang,
    };
    localStorage.setItem("sk_user", JSON.stringify(profile));
    localStorage.removeItem("sk_partial_user");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-emerald-50 to-white">
      <Header />
      <main className="container mx-auto px-4 py-10 max-w-2xl">
        <Card>
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold mb-2">Tell us about your farm</h1>
            <p className="text-sm text-muted-foreground mb-4">
              This helps CropSathi give better localized recommendations.
            </p>
            <div className="grid gap-3">
              <div>
                <Label>Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label>State</Label>
                <Input
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                />
              </div>
              <div>
                <Label>Area / Village</Label>
                <Input value={area} onChange={(e) => setArea(e.target.value)} />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <Label>Latitude</Label>
                  <Input value={lat} onChange={(e) => setLat(e.target.value)} />
                </div>
                <div>
                  <Label>Longitude</Label>
                  <Input value={lon} onChange={(e) => setLon(e.target.value)} />
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <Button
                  onClick={() => {
                    if (!navigator.geolocation)
                      return alert("Geolocation not supported");
                    navigator.geolocation.getCurrentPosition(
                      (pos) => {
                        setLat(String(pos.coords.latitude));
                        setLon(String(pos.coords.longitude));
                        setArea("Detected Location");
                        setStateName("Detected State");
                      },
                      (err) => {
                        alert("Unable to fetch location: " + err.message);
                      },
                    );
                  }}
                  className="bg-emerald-600 text-white"
                >
                  Use my location
                </Button>
                <div className="text-sm text-muted-foreground">
                  (App will request permission to access your location)
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 mt-3">
                <div>
                  <Label>PH value (optional)</Label>
                  <div className="flex items-center gap-3 mb-2">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="ph_mode"
                        value="manual"
                        checked={phMode === "manual"}
                        onChange={() => setPhMode("manual")}
                        className=""
                      />
                      <span className="text-sm">Enter manually</span>
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="ph_mode"
                        value="satellite"
                        checked={phMode === "satellite"}
                        onChange={async () => {
                          const val = await fetchSatellitePh();
                          if (val !== null) setPhMode("satellite");
                        }}
                      />
                      <span className="text-sm">Use satellite data</span>
                    </label>
                  </div>
                  <Input
                    value={ph}
                    onChange={(e) => setPh(e.target.value)}
                    placeholder="e.g. 6.3"
                    disabled={phMode === "satellite"}
                  />
                  <div className="mt-2 text-xs text-muted-foreground">
                    Tip: Satellite data may provide an estimated pH based on
                    location. You can switch back to manual to edit.
                  </div>
                </div>
                <div>
                  <Label>Farm size (e.g. 2 acres)</Label>
                  <Input
                    value={farmSize}
                    onChange={(e) => setFarmSize(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <Label>Years of experience</Label>
                  <Input
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Soil type</Label>
                  <Select value={soilType} onValueChange={setSoilType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select soil" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="loam">Loam</SelectItem>
                      <SelectItem value="sandy">Sandy</SelectItem>
                      <SelectItem value="clay">Clay</SelectItem>
                      <SelectItem value="silt">Silt</SelectItem>
                      <SelectItem value="peat">Peat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Earlier crops (comma separated)</Label>
                <Input
                  value={prevCrops}
                  onChange={(e) => setPrevCrops(e.target.value)}
                  placeholder="Wheat, Tomato"
                />
              </div>

              <div className="mt-4">
                <Button
                  className="w-full bg-gradient-to-r from-emerald-600 to-lime-600"
                  onClick={submit}
                >
                  Save Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
