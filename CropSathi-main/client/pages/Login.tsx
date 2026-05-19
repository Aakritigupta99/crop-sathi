import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useNavigate } from "react-router-dom";
import { Phone, Languages } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export default function Login() {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [lang, setLang] = useState<string>(() => localStorage.getItem("sk_lang") || "en");
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem("sk_lang", lang);
  }, [lang]);

  const sendOtp = () => {
    // sanitize and accept numbers with country code
    const digits = phone.replace(/[^0-9]/g, "");
    let sanitized = digits;
    if (digits.length > 10) {
      // prefer last 10 digits
      sanitized = digits.slice(-10);
    }
    if (/^\d{10}$/.test(sanitized)) {
      setPhone(sanitized);
      // In real app: request OTP from server here
      setStep("otp");
    } else {
      window.alert("Please enter a valid 10-digit mobile number.");
    }
  };

  const verify = () => {
    if (otp.length === 6) {
      // In a real app you'd verify the OTP with the server
      localStorage.setItem("sk_partial_user", JSON.stringify({ phone, lang }));
      // Also set a basic sk_user so header shows logged-in state immediately
      try {
        localStorage.setItem("sk_user", JSON.stringify({ phone }));
      } catch (e) {
        // ignore storage errors
      }
      // After verifying OTP, redirect to profile setup to collect farmer details
      navigate("/profile");
    } else {
      window.alert("Enter the 6-digit OTP sent to your phone.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-emerald-50 to-white">
      <Header />
      <main className="container mx-auto px-4 py-10 max-w-xl">
        <Card>
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold mb-1">Welcome to CropSathi</h1>
            <p className="text-sm text-muted-foreground mb-6">Login with your mobile number. No password needed.</p>
            <p className="font-semibold mb-6">
  Use Dummy Otp to check the app.
</p>

            <div className="grid gap-4">
              <div>
                <Label className="flex items-center gap-2 mb-2"><Languages className="h-4 w-4"/>Language preference</Label>
                <Select value={lang} onValueChange={setLang}>
                  <SelectTrigger><SelectValue placeholder="Select language" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">हिंदी</SelectItem>
                    <SelectItem value="te">తెలుగు</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {step === "phone" && (
                <div className="space-y-3">
                  <Label className="flex items-center gap-2"><Phone className="h-4 w-4"/>Mobile number</Label>
                  <Input inputMode="numeric" maxLength={10} pattern="[0-9]*" placeholder="Enter 10-digit number" value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, "").slice(0,10))} className="h-12 text-base" />
                  <Button className="w-full h-12 text-base bg-gradient-to-r from-emerald-600 to-lime-600" onClick={sendOtp}>Send OTP</Button>
                </div>
              )}

              {step === "otp" && (
                <div className="space-y-4">
                  <div>
                    <Label>Enter OTP</Label>
                    <div className="mt-2 flex justify-center">
                      <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                        <InputOTPGroup>
                          {Array.from({ length: 6 }).map((_, i) => (
                            <InputOTPSlot key={i} index={i} />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>
                  <Button className="w-full h-12 text-base" onClick={verify}>Verify & Continue</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
