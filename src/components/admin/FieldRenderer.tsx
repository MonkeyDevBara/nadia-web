"use client";

import { useId } from "react";
import FormField, { inputClass } from "@/components/ui/FormField";
import type { SocialLink } from "@/types/database";
import type { FieldDef, FieldValue, FormValues } from "./fieldTypes";
import IconPicker from "./IconPicker";
import ImageUploader from "./ImageUploader";
import MarkdownEditor from "./MarkdownEditor";
import SocialsEditor from "./SocialsEditor";
import TagInput from "./TagInput";

type FieldRendererProps = {
  field: FieldDef;
  values: FormValues;
  error?: string;
  onChange: (name: string, value: FieldValue) => void;
};

function asString(v: FieldValue | undefined): string {
  return typeof v === "string" ? v : v == null ? "" : String(v);
}

export default function FieldRenderer({ field, values, error, onChange }: FieldRendererProps) {
  const id = useId();
  const raw = values[field.name];
  const set = (v: FieldValue) => onChange(field.name, v);

  if (field.type === "toggle") {
    return (
      <div>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={raw === true}
            onChange={(e) => set(e.target.checked)}
            className="mt-0.5 h-5 w-5 rounded border-stone-300 accent-stone-900"
          />
          <span>
            <span className="block text-sm font-medium text-stone-800">{field.label}</span>
            {field.hint ? <span className="block text-xs text-stone-500">{field.hint}</span> : null}
          </span>
        </label>
        {error ? <p role="alert" className="mt-1 text-xs text-red-600">{error}</p> : null}
      </div>
    );
  }

  let control: React.ReactNode;
  switch (field.type) {
    case "text":
    case "url":
    case "email":
    case "tel":
      control = (
        <input
          id={id}
          type={field.type === "url" ? "text" : field.type}
          inputMode={field.type === "url" ? "url" : undefined}
          value={asString(raw)}
          onChange={(e) => set(e.target.value)}
          placeholder={field.placeholder}
          className={inputClass}
        />
      );
      break;
    case "color":
      control = (
        <div className="flex items-center gap-2">
          <input
            id={id}
            type="color"
            value={/^#[0-9a-fA-F]{6}$/.test(asString(raw)) ? asString(raw) : "#b8a797"}
            onChange={(e) => set(e.target.value)}
            className="h-10 w-14 cursor-pointer rounded border border-stone-300 bg-white p-1"
          />
          <input
            type="text"
            aria-label={`${field.label} (kode hex)`}
            value={asString(raw)}
            onChange={(e) => set(e.target.value)}
            placeholder="#B8A797"
            className={`${inputClass} max-w-[9rem]`}
          />
          {asString(raw) ? (
            <button type="button" onClick={() => set(null)} className="text-sm text-stone-600 underline">
              Reset
            </button>
          ) : null}
        </div>
      );
      break;
    case "textarea":
      control = (
        <textarea
          id={id}
          rows={field.rows ?? 4}
          value={asString(raw)}
          onChange={(e) => set(e.target.value)}
          placeholder={field.placeholder}
          className={inputClass}
        />
      );
      break;
    case "number":
      control = (
        <input
          id={id}
          type="number"
          min={field.min}
          max={field.max}
          value={typeof raw === "number" ? raw : ""}
          onChange={(e) => set(e.target.value === "" ? null : Number(e.target.value))}
          className={`${inputClass} max-w-[10rem]`}
        />
      );
      break;
    case "select":
      control = (
        <select id={id} value={asString(raw)} onChange={(e) => set(e.target.value)} className={inputClass}>
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
      break;
    case "image":
      control = (
        <ImageUploader
          value={typeof raw === "string" && raw ? raw : null}
          onChange={(url) => set(url)}
          folder={field.folder}
          label="gambar"
          aspect={field.aspect}
          transparent={field.transparent}
        />
      );
      break;
    case "icon":
      control = <IconPicker value={asString(raw)} onChange={set} />;
      break;
    case "tags":
      control = (
        <TagInput
          id={id}
          value={Array.isArray(raw) ? (raw as string[]) : []}
          onChange={set}
          placeholder={field.placeholder}
        />
      );
      break;
    case "markdown":
      control = <MarkdownEditor id={id} value={asString(raw)} onChange={set} />;
      break;
    case "socials":
      control = <SocialsEditor value={Array.isArray(raw) ? (raw as SocialLink[]) : []} onChange={set} />;
      break;
  }

  return (
    <FormField label={field.label} htmlFor={id} hint={field.hint} error={error} required={field.required}>
      {control}
    </FormField>
  );
}
