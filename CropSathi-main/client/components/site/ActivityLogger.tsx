import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ActivityLogger({ showHistory = true }: { showHistory?: boolean }) {
  const [activity, setActivity] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("sk_activities") || "[]");
    } catch { return [] }
  });

  useEffect(() => {
    localStorage.setItem("sk_activities", JSON.stringify(items));
  }, [items]);

  const add = () => {
    if (!activity.trim()) return;
    const it = { id: Date.now(), activity, notes, date: new Date().toISOString() };
    setItems((s) => [it, ...s]);
    setActivity("");
    setNotes("");
  };

  const remove = (id: number) => {
    setItems((s) => s.filter((i) => i.id !== id));
  };

  return (
    <div className="mt-3">
      <div className="grid gap-2">
        <Input placeholder="Activity (e.g. Applied fertilizer)" value={activity} onChange={(e) => setActivity(e.target.value)} />
        <Input placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <Button className="w-full" onClick={add}>Add Activity</Button>
      </div>

      {showHistory && (
        <div className="mt-3 space-y-2">
          {items.length === 0 ? (
            <div className="text-sm text-muted-foreground">No activities yet</div>
          ) : (
            items.map((it) => (
              <div key={it.id} className="flex items-start justify-between bg-white p-2 rounded-md border">
                <div>
                  <div className="font-semibold">{it.activity}</div>
                  {it.notes && <div className="text-sm text-muted-foreground">{it.notes}</div>}
                  <div className="text-xs text-muted-foreground">{new Date(it.date).toLocaleString()}</div>
                </div>
                <div>
                  <button className="text-red-500 text-sm" onClick={() => remove(it.id)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
