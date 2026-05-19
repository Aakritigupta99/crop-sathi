import { useState } from "react";
import { cn } from "@/lib/utils";

const DEFAULT_LOGO =
  (import.meta as any).env?.VITE_LOGO_URL ||
  "https://cdn.builder.io/api/v1/image/assets%2Fb6ec294310c24f07b6886375a5e55d0b%2Fb40005f17917414789bccef624ed7010?format=webp&width=800";

export function Logo({ className }: { className?: string }) {
  const [ok, setOk] = useState(true);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {ok ? (
        <img
          src={DEFAULT_LOGO}
          alt="Crop Sathi logo"
          className="h-8 w-8 rounded-md shadow-sm object-contain"
          onError={() => setOk(false)}
        />
      ) : (
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-emerald-500 to-lime-500 text-white font-bold shadow-sm">
          SK
        </span>
      )}
      <span className="text-lg font-extrabold tracking-tight">
        Crop<span className="text-emerald-600">Sathi</span>
      </span>
    </div>
  );
}
