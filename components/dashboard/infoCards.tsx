"use client";

import { InfoCardProps } from "@/types";

export function InfoCards({ title, value, icon, className }: InfoCardProps) {
  return (
    <div className="p-4 rounded-lg border border-gray-200 bg-white shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div>{icon}</div>
      </div>
    </div>
  );
}
