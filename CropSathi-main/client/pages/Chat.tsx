import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mic, ImageUp } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface Message { role: 'user' | 'assistant'; content: string }

export default function Chat() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");
  const user = JSON.parse(localStorage.getItem("sk_user") || 'null');
  const storageKey = `sk_chat_history_${user?.phone || "public"}`;

  const defaultAssistant = `नमस्ते! How can I help you with your crops today?`;
  const autoQuestion = `what type of fertilizer should i use on my`;
  const autoAnswer = `Based on your soil pH value of 6.3 (slightly acidic) and considering that it is the month of September in your region, I recommend using a Nitrogen-rich fertilizer like Urea or DAP in small quantities. This will support healthy root and leaf development for your upcoming wheat/vegetable crop season. 💡 Tip: Since your soil pH is slightly acidic, also add a little lime treatment once in 6 months to balance soil health.`;

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const fresh = params.get('fresh') === 'false' ? false : true;

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (fresh) {
      // start fresh session (don't overwrite stored history)
      setMessages([{ role: 'assistant', content: defaultAssistant }]);
      return;
    }

    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
        return;
      } catch {}
    }
    // initialize with assistant greeting and auto QA
    const init: Message[] = [
      { role: 'assistant', content: defaultAssistant },
      { role: 'user', content: autoQuestion },
      { role: 'assistant', content: autoAnswer },
    ];
    setMessages(init);
    localStorage.setItem(storageKey, JSON.stringify(init));
  }, [storageKey, fresh]);

  useEffect(() => {
    if (!fresh) {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, storageKey, fresh]);

  const send = async () => {
    if (!text.trim()) return;
    const userMsg: Message = { role: 'user', content: text };

    // optimistic UI
    setMessages((m) => [...m, userMsg]);
    setText("");

    try {
      const payload = { messages: [...messages, userMsg] };
      const r = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!r.ok) throw new Error(await r.text());
      const data = (await r.json()) as { reply?: string };
      const reply = data?.reply || 'Sorry, I could not generate a response.';
      setMessages((m) => [...m, { role: 'assistant', content: reply }]);

      if (!fresh) {
        try { localStorage.setItem(storageKey, JSON.stringify([...messages, userMsg, { role: 'assistant', content: reply }])); } catch {}
      }
    } catch (e: any) {
      setMessages((m) => [...m, { role: 'assistant', content: 'Error contacting AI service.' }]);
    }
  };

  const clearHistory = () => {
    if (confirm('Clear chat history?')) {
      setMessages([]);
      localStorage.removeItem(storageKey);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-emerald-50 to-white">
      <Header />
      <main className="container mx-auto px-4 py-6 max-w-3xl w-full">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Ask CropSathi</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={clearHistory}>Clear</Button>
          </div>
        </div>
        <Card>
          <CardContent className="p-0">
            <div className="h-[60vh] overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={m.role==='user'? 'flex justify-end' : 'flex justify-start'}>
                  <div className={(m.role==='user'? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-900') + ' rounded-2xl px-4 py-2 max-w-[80%] whitespace-pre-wrap'}>
                    <div dangerouslySetInnerHTML={{ __html: (m.content || '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t flex items-center gap-2">
              <Button variant="secondary" className="shrink-0" onClick={() => fileRef.current?.click()}><ImageUp className="mr-2"/>Image</Button>
              <input type="file" accept="image/*" ref={fileRef} className="hidden" onChange={(e)=>{
                const f = e.target.files?.[0];
                if (!f) return;
                const url = URL.createObjectURL(f);
                setMessages((m)=>[...m, {role:'user', content: 'Uploaded an image for diagnosis.'},{role:'assistant', content: 'Please wait while I analyze the image...' }]);
                setTimeout(()=>{
                  const ai = 'AI Diagnosis: Symptoms look like early-stage leaf blight. Please check Diagnose tool for a detailed report.';
                  setMessages((m)=>[...m, {role:'assistant', content: ai}]);
                  if (fresh) {
                    try {
                      const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
                      localStorage.setItem(storageKey, JSON.stringify([...saved, {role:'user', content:'Uploaded an image for diagnosis.'}, {role:'assistant', content: ai}]));
                    } catch {}
                  }
                },1000);
              }} />
              <Input value={text} onChange={(e)=>setText(e.target.value)} placeholder="Type in your language..." className="h-12" />
              <Button className="h-12" onClick={send}>Send</Button>
              <Button variant="outline" className="h-12 w-12 p-0"><Mic/></Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
