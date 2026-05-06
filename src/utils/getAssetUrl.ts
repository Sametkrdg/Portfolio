/**
 * Returns the full CDN URL for a heavy asset (3D model, HDRI, audio) when
 * NEXT_PUBLIC_R2_BUCKET_URL is set, or falls back to the local /public path
 * so development works without any CDN configuration.
 *
 * Usage:
 *   getAssetUrl("hero-env.hdr")      → "https://<bucket>.r2.dev/hero-env.hdr"
 *   getAssetUrl("models/robot.glb")  → "https://<bucket>.r2.dev/models/robot.glb"
 */
export function getAssetUrl(filename: string): string {
  const base = process.env.NEXT_PUBLIC_R2_BUCKET_URL;
  if (base) {
    const trimmed = base.replace(/\/$/, "");
    return `${trimmed}/${filename}`;
  }
  return `/${filename}`;
}
