import { PhoneCall, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export function EmergencyButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-full bg-red-600 text-white px-4 py-3 shadow-lg hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        aria-label="Emergency helpline"
      >
        <PhoneCall className="h-4 w-4" /> Emergency
      </button>

      {open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="bg-white rounded-md shadow-lg z-50 max-w-sm w-full mx-4 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold">Emergency Help</div>
              <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-muted">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-3">Choose an option below:</p>
            <div className="flex flex-col gap-3">
              <a href="tel:18001801551" className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded bg-red-600 text-white">Call Government Helpline</a>
              <Link to="/chat?fresh=true" className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded border">Chat with AI</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
