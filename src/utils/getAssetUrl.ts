/**
 * Returns the full URL for a heavy asset (3D model, HDRI, audio).
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_FORCE_LOCAL_ASSETS === "1"  →  /public path
 *      Use this in `.env.local` to bypass R2 entirely during local dev
 *      (e.g. when R2 CORS isn't configured or the bucket is offline).
 *   2. NEXT_PUBLIC_R2_BUCKET_URL is set        →  https://<bucket>.r2.dev/...
 *   3. Fallback                                →  /public path
 *
 * Usage:
 *   getAssetUrl("hero-env.hdr")     → "/hero-env.hdr"           (local)
 *                                     or "https://…/hero-env.hdr" (R2)
 *   getAssetUrl("models/robot.glb") → "/models/robot.glb"        (local)
 */
export function getAssetUrl(filename: string): string {
  if (process.env.NEXT_PUBLIC_FORCE_LOCAL_ASSETS === "1") {
    return `/${filename}`;
  }

  const base = process.env.NEXT_PUBLIC_R2_BUCKET_URL;
  if (base) {
    const trimmed = base.replace(/\/$/, "");
    return `${trimmed}/${filename}`;
  }
  return `/${filename}`;
}
