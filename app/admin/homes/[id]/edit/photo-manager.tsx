"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "home-photos";
const MAX_PHOTOS = 10;

// Matches the folder naming already used in Storage, e.g.
// "Fairmount Condominium" -> "fairmount-condominium".
function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Public URLs look like
// https://<project>.supabase.co/storage/v1/object/public/home-photos/<path>
// — pull the <path> back out so we can pass it to storage.remove().
function pathFromPublicUrl(url: string): string | null {
  const marker = `/object/public/${BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(url.slice(index + marker.length));
}

export default function PhotoManager({
  homeId,
  homeTitle,
  initialPhotoUrls,
}: {
  homeId: string;
  homeTitle: string;
  initialPhotoUrls: string[];
}) {
  const [photoUrls, setPhotoUrls] = useState(initialPhotoUrls);
  const [uploading, setUploading] = useState(false);
  const [removingUrl, setRemovingUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const slug = slugify(homeTitle);

  async function persistPhotoUrls(urls: string[]) {
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("homes")
      .update({ photo_urls: urls })
      .eq("id", homeId);

    if (updateError) {
      throw new Error(updateError.message);
    }
  }

  async function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = ""; // allow re-selecting the same file later
    if (files.length === 0) return;

    setError(null);

    const nonImages = files.filter((f) => !f.type.startsWith("image/"));
    const images = files.filter((f) => f.type.startsWith("image/"));

    if (nonImages.length > 0 && images.length === 0) {
      setError(
        `${nonImages.length === 1 ? "That file isn't an image" : "Those files aren't images"} — only image files can be uploaded.`
      );
      return;
    }

    if (photoUrls.length + images.length > MAX_PHOTOS) {
      setError(
        `This listing has ${photoUrls.length} photo${photoUrls.length === 1 ? "" : "s"} already, and you selected ${images.length} more — that's over the ${MAX_PHOTOS}-photo limit. Remove some existing photos or select fewer, then try again.`
      );
      return;
    }

    if (nonImages.length > 0) {
      setError(
        `Skipping ${nonImages.length} non-image file${nonImages.length === 1 ? "" : "s"} — uploading the rest.`
      );
    }

    setUploading(true);
    const supabase = createClient();
    const uploadedUrls: string[] = [];
    const failed: string[] = [];

    for (const file of images) {
      const ext = file.name.includes(".")
        ? file.name.split(".").pop()!.toLowerCase()
        : "jpg";
      const path = `${slug}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { contentType: file.type });

      if (uploadError) {
        failed.push(file.name);
        continue;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET).getPublicUrl(path);
      uploadedUrls.push(publicUrl);
    }

    if (uploadedUrls.length > 0) {
      const nextUrls = [...photoUrls, ...uploadedUrls];
      try {
        await persistPhotoUrls(nextUrls);
        setPhotoUrls(nextUrls);
      } catch (err) {
        setError(
          err instanceof Error
            ? `Photos uploaded but couldn't be saved to the listing: ${err.message}`
            : "Photos uploaded but couldn't be saved to the listing."
        );
        setUploading(false);
        return;
      }
    }

    if (failed.length > 0) {
      setError(
        `${failed.length} photo${failed.length === 1 ? "" : "s"} failed to upload: ${failed.join(", ")}. Try again.`
      );
    }

    setUploading(false);
  }

  async function handleRemove(url: string) {
    if (!window.confirm("Remove this photo? This can't be undone.")) return;

    setError(null);
    setRemovingUrl(url);

    const path = pathFromPublicUrl(url);
    const supabase = createClient();

    if (path) {
      const { error: removeError } = await supabase.storage
        .from(BUCKET)
        .remove([path]);

      if (removeError) {
        setError(`Couldn't remove the photo from storage: ${removeError.message}`);
        setRemovingUrl(null);
        return;
      }
    }

    const nextUrls = photoUrls.filter((u) => u !== url);
    try {
      await persistPhotoUrls(nextUrls);
      setPhotoUrls(nextUrls);
    } catch (err) {
      setError(
        err instanceof Error
          ? `Removed from storage but couldn't update the listing: ${err.message}`
          : "Removed from storage but couldn't update the listing."
      );
    }

    setRemovingUrl(null);
  }

  return (
    <div>
      <label className="block font-body text-sm font-medium text-ink">
        Photos ({photoUrls.length}/{MAX_PHOTOS})
      </label>

      {error && (
        <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 font-body text-sm text-red-700">
          {error}
        </p>
      )}

      {photoUrls.length > 0 && (
        <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {photoUrls.map((url) => (
            <div
              key={url}
              className="group relative aspect-square overflow-hidden rounded-xl bg-stone-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemove(url)}
                disabled={removingUrl === url}
                aria-label="Remove photo"
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink/70 text-xs text-stone-50 hover:bg-red-700 disabled:opacity-50"
              >
                {removingUrl === url ? "…" : "×"}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 rounded-xl border border-dashed border-border p-6 text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          disabled={uploading || photoUrls.length >= MAX_PHOTOS}
          onChange={handleFilesSelected}
          className="font-body text-sm text-ink-muted disabled:opacity-50"
        />
        <p className="mt-2 font-body text-xs text-ink-muted">
          {photoUrls.length >= MAX_PHOTOS
            ? "Photo limit reached — remove one to add another."
            : uploading
              ? "Uploading…"
              : "Select one or more images to upload."}
        </p>
      </div>
    </div>
  );
}
