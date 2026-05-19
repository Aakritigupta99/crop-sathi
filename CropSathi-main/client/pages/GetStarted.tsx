import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function GetStarted() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-emerald-50 to-white">
      <Header />
      <main className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-extrabold mb-4">Welcome to CropSathi</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          CropSathi helps every farmer with AI-powered recommendations. Sign up
          to get personalized guidance.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button
            asChild
            className="bg-gradient-to-r from-emerald-600 to-lime-600 h-12 px-6"
          >
            <Link to="/profile">Start Signup</Link>
          </Button>
          <Button asChild variant="outline" className="h-12 px-6">
            <Link to="/login">Already have an account? Login</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
