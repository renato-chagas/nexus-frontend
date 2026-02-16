"use client";

import { Eye, EyeOff, Mail, Lock } from "lucide-react";

type InputProps = {
  label: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  icon?: "mail" | "lock";
  showPassword?: boolean;
  toggleShowPassword?: () => void;
};

export function Input({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  icon,
  showPassword,
  toggleShowPassword,
}: InputProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        {icon === "mail" && (
          <Mail
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
        )}
        {icon === "lock" && (
          <Lock
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full ${icon ? "pl-10" : ""} ${icon === "lock" && toggleShowPassword ? "pr-10" : "pr-4"} py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-black`}
          placeholder={placeholder}
          required
        />
        {icon === "lock" && toggleShowPassword && (
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
}
