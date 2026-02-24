"use client";

type InputProps = {
  label: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  horizontal?: boolean; 
};

export function Input({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  horizontal = false,
}: InputProps) {
  const baseClass = "text-sm font-medium text-gray-700";

  if (type === "checkbox") {
    return (
      <div className="w-full">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={value === "true"}
            className="w-4 h-4 cursor-pointer flex-shrink-0"
            onChange={(e) => onChange(e.target.checked ? "true" : "false")}
          />
          <label className={`${baseClass} cursor-pointer`}>{label}</label>
        </div>
      </div>
    );
  }

  if (type === "textarea") {
    if (horizontal) {
      return (
        <div className="w-full flex items-center gap-2">
          <label className={`${baseClass} w-1/4`}>{label}</label>
          <textarea
            value={value}
            className="flex-1 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-black resize-none"
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
          />
        </div>
      );
    }

    return (
      <div className="w-full">
        <label className={`${baseClass} block mb-1`}>{label}</label>
        <textarea
          value={value}
          className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-black resize-none"
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      <label className={`${baseClass} block mb-1`}>{label}</label>
      <input
        type={type}
        value={value}
        className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
}
