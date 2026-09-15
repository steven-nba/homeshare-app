"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import PhotoManager from "./photo-manager";
import type { Home } from "@/lib/types";

export default function EditForm({ home }: { home: Home }) {
  const [title, setTitle] = useState(home.title);
  const [description, setDescription] = useState(home.description);
  const [generalLocation, setGeneralLocation] = useState(home.generalLocation);
  const [amenitiesText, setAmenitiesText] = useState(home.amenities.join(", "));
  const [houseRules, setHouseRules] = useState(home.houseRules);
  const [careCallout, setCareCallout] = useState(home.careCallout ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const amenities = amenitiesText
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("homes")
      .update({
        title,
        description,
        general_location: generalLocation,
        amenities,
        house_rules: houseRules,
        care_callout: careCallout.trim() === "" ? null : careCallout,
      })
      .eq("id", home.id);

    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 font-body text-sm text-red-700">
          {error}
        </p>
      )}
      {saved && (
        <p className="rounded-lg bg-olive-50 px-3 py-2 font-body text-sm text-olive-900">
          Saved.
        </p>
      )}

      <div>
        <label className="block font-body text-sm font-medium text-ink">
          Title
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 font-body text-sm text-ink"
        />
      </div>

      <div>
        <label className="block font-body text-sm font-medium text-ink">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 font-body text-sm text-ink"
        />
      </div>

      <div>
        <label className="block font-body text-sm font-medium text-ink">
          General location
        </label>
        <input
          value={generalLocation}
          onChange={(e) => setGeneralLocation(e.target.value)}
          placeholder="e.g. Coastal Maine"
          className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 font-body text-sm text-ink"
        />
      </div>

      <div>
        <label className="block font-body text-sm font-medium text-ink">
          Amenities
        </label>
        <input
          value={amenitiesText}
          onChange={(e) => setAmenitiesText(e.target.value)}
          placeholder="Wifi, Pool, Parking"
          className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 font-body text-sm text-ink"
        />
        <p className="mt-1 font-body text-xs text-ink-muted">
          Comma-separated.
        </p>
      </div>

      <div>
        <label className="block font-body text-sm font-medium text-ink">
          House rules
        </label>
        <textarea
          value={houseRules}
          onChange={(e) => setHouseRules(e.target.value)}
          rows={4}
          className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 font-body text-sm text-ink"
        />
      </div>

      <div>
        <label className="block font-body text-sm font-medium text-ink">
          Care callout
        </label>
        <textarea
          value={careCallout}
          onChange={(e) => setCareCallout(e.target.value)}
          rows={3}
          placeholder="Optional — e.g. Please water the herb garden twice a week"
          className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 font-body text-sm text-ink"
        />
        <p className="mt-1 font-body text-xs text-ink-muted">
          Optional — leave empty to clear it.
        </p>
      </div>

      <PhotoManager
        homeId={home.id}
        homeTitle={home.title}
        initialPhotoUrls={home.photoUrls}
      />

      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-olive-700 px-5 py-2 font-body text-sm text-stone-50 hover:bg-olive-600 disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
