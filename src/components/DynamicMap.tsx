"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

export const DynamicAlertMap = dynamic(() => import("./AlertMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 flex-col gap-3">
      <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
      <span className="text-gray-500 font-medium tracking-tight">Chargement de la cartographie...</span>
    </div>
  ),
});
