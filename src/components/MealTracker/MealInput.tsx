"use client";

import { useState } from "react";
import { Sparkles, Camera } from "lucide-react";
import ImageUpload from "@/components/MealTracker/ImageUpload";

export default function MealInput({ onLogged }: { onLogged: () => void }) {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim()) return;
    setLoading(true);
    setError(null);

    const res = await fetch("/api/meals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description }),
    });

    if (!res.ok) {
      const json = await res.json();
      setError(json.error ?? "Failed to log meal");
    } else {
      setDescription("");
      onLogged();
    }
    setLoading(false);
  }

  return (
    <div className="card space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Log a meal</h2>
        <button
          onClick={() => setShowImageUpload((v) => !v)}
          className="flex items-center gap-1 text-sm text-brand-600 dark:text-brand-400"
        >
          <Camera size={16} /> Photo
        </button>
      </div>

      {showImageUpload ? (
        <ImageUpload
          onLogged={() => {
            onLogged();
            setShowImageUpload(false);
          }}
        />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <textarea
            className="input min-h-[80px] resize-none"
            placeholder="e.g. 2 eggs, a slice of toast with peanut butter and a banana"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full gap-2">
            <Sparkles size={16} />
            {loading ? "Analyzing…" : "Analyze & log meal"}
          </button>
        </form>
      )}
    </div>
  );
}
