import { useEffect, useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, MapPin } from "lucide-react";

interface DayForecast {
  day: string;
  emoji: string;
  tempMax: number;
  tempMin: number;
  wind: number;
  description: string;
  rain: number;
}

const WEATHER_EMOJIS: Record<string, string> = {
  Clear: "☀️", Clouds: "☁️", Rain: "🌧️", Drizzle: "🌦️",
  Thunderstorm: "⛈️", Snow: "❄️", Mist: "🌫️", Haze: "🌫️",
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Weather() {
  const [city, setCity] = useState("Kolkata");
  const [search, setSearch] = useState("Kolkata");
  const [forecast, setForecast] = useState<DayForecast[]>([]);
  const [current, setCurrent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fallback mock data when no API key
  const mockForecast = (): DayForecast[] => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => ({
      day: DAYS[(today.getDay() + i) % 7],
      emoji: i % 3 === 0 ? "🌧️" : i % 3 === 1 ? "☀️" : "⛅",
      tempMax: 30 + Math.floor(Math.random() * 5),
      tempMin: 22 + Math.floor(Math.random() * 4),
      wind: 10 + Math.floor(Math.random() * 15),
      description: i % 3 === 0 ? "Rain" : i % 3 === 1 ? "Clear sky" : "Partly cloudy",
      rain: i % 3 === 0 ? 12 : 0,
    }));
  };

  const fetchWeather = async (cityName: string) => {
    const apiKey = import.meta.env.VITE_OPENWEATHER_KEY;
    if (!apiKey) {
      // Use mock data
      setForecast(mockForecast());
      setCurrent({ name: cityName, temp: 28, desc: "Partly cloudy", humidity: 75, wind: 12 });
      setError("ℹ️ Using simulated data. Add VITE_OPENWEATHER_KEY to .env for live weather.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Current weather
      const curRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${apiKey}&units=metric`
      );
      if (!curRes.ok) throw new Error("City not found. Please check the name.");
      const curData = await curRes.json();

      setCurrent({
        name: curData.name,
        temp: Math.round(curData.main.temp),
        desc: curData.weather[0].description,
        humidity: curData.main.humidity,
        wind: Math.round(curData.wind.speed * 3.6),
      });

      // 5-day forecast
      const foreRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cityName)}&appid=${apiKey}&units=metric`
      );
      const foreData = await foreRes.json();

      // Group by day (one entry per day at noon)
      const byDay: Record<string, any[]> = {};
      for (const item of foreData.list) {
        const d = new Date(item.dt * 1000);
        const key = d.toDateString();
        if (!byDay[key]) byDay[key] = [];
        byDay[key].push(item);
      }

      const days7: DayForecast[] = Object.entries(byDay)
        .slice(0, 7)
        .map(([dateStr, items]) => {
          const d = new Date(dateStr);
          const temps = items.map((i) => i.main.temp);
          const main = items[Math.floor(items.length / 2)];
          const rainTotal = items.reduce((a, i) => a + (i.rain?.["3h"] || 0), 0);
          return {
            day: DAYS[d.getDay()],
            emoji: WEATHER_EMOJIS[main.weather[0].main] || "🌤️",
            tempMax: Math.round(Math.max(...temps)),
            tempMin: Math.round(Math.min(...temps)),
            wind: Math.round(main.wind.speed * 3.6),
            description: main.weather[0].description,
            rain: Math.round(rainTotal),
          };
        });

      setForecast(days7);
    } catch (err: any) {
      setError(err.message || "Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  const handleSearch = () => {
    if (search.trim()) setCity(search.trim());
  };

  // Farming advice based on weather
  const getFarmingTip = (): string => {
    if (!forecast.length) return "";
    const rainDays = forecast.filter((d) => d.rain > 0).length;
    const avgTemp = forecast.reduce((a, d) => a + d.tempMax, 0) / forecast.length;
    if (rainDays >= 4) return "🌧️ Heavy rain expected — avoid spraying pesticides this week. Ensure proper field drainage.";
    if (rainDays === 0) return "☀️ Dry week ahead — plan irrigation. Best time for spraying fertilizers.";
    if (avgTemp > 35) return "🌡️ High temperatures — water crops early morning or evening to reduce evaporation.";
    return "✅ Good farming week ahead! Moderate conditions are ideal for most field activities.";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-emerald-50 to-white">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl font-bold mb-1">7-Day Weather Forecast</h1>
        <p className="text-sm text-muted-foreground mb-4">Plan your farming activities with accurate weather data.</p>

        {/* Search */}
        <div className="flex gap-2 mb-6">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Enter city or village name..."
            className="h-11"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch} className="h-11 bg-emerald-600 hover:bg-emerald-700">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
          </Button>
        </div>

        {error && (
          <div className="mb-4 text-sm text-amber-700 bg-amber-50 rounded-lg p-3">{error}</div>
        )}

        {/* Current weather summary */}
        {current && (
          <Card className="mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">{current.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-5xl font-bold">{current.temp}°C</div>
                <div className="text-sm opacity-90">
                  <div className="capitalize">{current.desc}</div>
                  <div>Humidity: {current.humidity}%</div>
                  <div>Wind: {current.wind} km/h</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Farming tip */}
        {forecast.length > 0 && (
          <Card className="mb-4 bg-amber-50 border-amber-200">
            <CardContent className="p-4 text-sm text-amber-900">
              <span className="font-medium">🌾 Farming Tip: </span>{getFarmingTip()}
            </CardContent>
          </Card>
        )}

        {/* 7-day grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {loading
            ? Array.from({ length: 7 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4 text-center">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-8 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse" />
                  </CardContent>
                </Card>
              ))
            : forecast.map((d, i) => (
                <Card key={i} className={i === 0 ? "ring-2 ring-emerald-400" : ""}>
                  <CardContent className="p-4 text-center">
                    <div className="font-semibold text-sm">{i === 0 ? "Today" : d.day}</div>
                    <div className="mt-2 text-3xl">{d.emoji}</div>
                    <div className="mt-2 text-sm font-medium">{d.tempMax}°</div>
                    <div className="text-xs text-muted-foreground">{d.tempMin}°</div>
                    <div className="mt-1 text-xs text-muted-foreground">{d.wind} km/h</div>
                    {d.rain > 0 && (
                      <div className="mt-1 text-xs text-blue-600">💧{d.rain}mm</div>
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
