"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";

export default function ImageUpload({ onLogged }: { onLogged: () => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSubmit() {
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", file);
    if (caption) formData.append("caption", caption);

    const res = await fetch("/api/meals/image", { method: "POST", body: formData });

    if (!res.ok) {
      const json = await res.json();
      setError(json.error ?? "Failed to analyze image");
    } else {
      setFile(null);
      setPreview(null);
      setCaption("");
      onLogged();
    }
    setLoading(false);
  }

  return (
    <div className="space-y-3">
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="Food preview" className="h-48 w-full rounded-xl object-cover" />
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 dark:border-gray-700"
        >
          <Upload size={24} />
          <span className="text-sm">Tap to upload a food photo</span>
        </button>
      )}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      <input
        className="input"
        placeholder="Optional note (e.g. 'large portion')"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button onClick={handleSubmit} disabled={!file || loading} className="btn-primary w-full">
        {loading ? "Analyzing photo…" : "Analyze & log meal"}
      </button>
    </div>
  );
}
