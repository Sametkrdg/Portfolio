# Deployment & Infrastructure

## Live URL

`https://sametkaradag.com` — the canonical origin, and what `metadataBase`,
`hreflang` and the sitemap are built from.

Also pointing at the same project: `www.sametkaradag.com` and
`portfolio-nine-black-h49mev772x.vercel.app`.

---

## Environment Variables

Set these in **Vercel Dashboard → Project → Settings → Environment Variables**.
Tick **Preview** as well as **Production**, or the chat assistant returns 502
on branch previews.

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_R2_BUCKET_URL` | Yes (prod) | Cloudflare R2 public bucket URL — serves the HDRI and audio the `space` theme uses |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Yes | Gemini 2.5 Flash key for the AI chatbot edge function |
| `UPSTASH_REDIS_REST_URL` | Optional | Upstash Redis REST endpoint — enables `/api/chat` rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | Optional | Upstash Redis REST token |

Copy `.env.example` → `.env.local` for local development.

---

## Cloudflare R2 — Asset CDN

Heavy assets (3D models, HDRI maps, audio) are served from R2 to stay under Vercel's 100 GB/month bandwidth limit.

### Bucket folder structure

```
<bucket-root>/
  hero-env.hdr                          # space theme's HDRI environment map
  models/
    space_maintenance_robot.glb         # no longer used — the 3D chat robot
                                        # was removed with the chatbot rewrite
  audio/
    audio.mp3                           # space theme's background music
```

### CORS policy

Applied via **Cloudflare R2 Dashboard → Bucket → Settings → CORS Policy**.

> **Why this is needed:** Browsers block cross-origin fetch requests by default.
> Three.js (`useGLTF`), the Web Audio API (`MediaElementAudioSourceNode`), and
> `@react-three/drei`'s `Environment` loader all fetch assets via `fetch()`/XHR,
> so the bucket must explicitly allow requests from the app's origin.

```json
[
  {
    "AllowedOrigins": [
      "https://sametkaradag.com",
      "https://www.sametkaradag.com",
      "https://portfolio-nine-black-h49mev772x.vercel.app",
      "http://localhost:3000"
    ],
    "AllowedMethods": ["GET", "POST", "PUT"],
    "AllowedHeaders": ["*"]
  }
]
```

**Preview deployments get their own origin.** A branch preview URL is not in
`AllowedOrigins`, so the `space` theme's HDRI and audio will be CORS-blocked
there until you add it. Every other theme is unaffected — they load no R2
assets at all.

### crossOrigin attribute

All R2 asset consumers already set `crossOrigin = "anonymous"` in the codebase:

- `src/themes/space/canvas/audioStore.ts` — `audio.crossOrigin = "anonymous"` before `audio.src` is assigned
- `@react-three/drei`'s `useGLTF` and `Environment` loaders set this automatically

---

## Deploying

### Vercel Git integration (recommended)

Every push to `main` triggers a production deploy automatically.

```bash
git add -A
git commit -m "your message"
git push origin main
```

### Vercel CLI

```bash
vercel deploy --prod
```

---

## Build verification

```bash
npm run build
```

Expected output:

```
✓ Compiled successfully
✓ TypeScript — 0 errors
● /[locale]/[[...theme]]   (SSG — 14 pages: 7 themes × 2 locales)
○ /robots.txt  /sitemap.xml  /icon.svg   (static)
ƒ /api/chat                              (edge function — expected)
```

The `/api/chat` edge-runtime notice is correct and expected — it is the Gemini chatbot route.
