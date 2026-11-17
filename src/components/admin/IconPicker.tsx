"use client";

import { iconMap } from "@/lib/utils/icons";

type IconPickerProps = { value: string; onChange: (name: string) => void };

export default function IconPicker({ value, onChange }: IconPickerProps) {
  return (
    <div role="radiogroup" aria-label="Pilih ikon" className="grid grid-cols-6 gap-2 sm:grid-cols-8">
      {Object.entries(iconMap).map(([name, Icon]) => {
        const selected = name === value;
        return (
          <button
            key={name}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={name}
            title={name}
            onClick={() => onChange(name)}
            className={`flex aspect-square items-center justify-center rounded-md border transition-colors ${
              selected
                ? "border-stone-900 bg-stone-900 text-white"
                : "border-stone-300 bg-white text-stone-700 hover:border-stone-500"
            }`}
          >
            <Icon size={20} aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
