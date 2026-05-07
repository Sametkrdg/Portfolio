# Deployment & Infrastructure

## Live URL

`https://portfolio-nine-black-h49mev772x.vercel.app`

---

## Environment Variables

Set these in **Vercel Dashboard → Project → Settings → Environment Variables**.

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_R2_BUCKET_URL` | Yes (prod) | Cloudflare R2 public bucket URL — serves 3D models, HDRI, audio |
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
  hero-env.hdr                          # Night-sky HDRI environment map
  models/
    space_maintenance_robot.glb         # Hero section 3D robot model
  audio/
    MYSTERY.mp3                         # Hero section background music
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
      "https://portfolio-nine-black-h49mev772x.vercel.app",
      "http://localhost:3000"
    ],
    "AllowedMethods": ["GET", "POST", "PUT"],
    "AllowedHeaders": ["*"]
  }
]
```

**To add a custom domain later**, append it to `AllowedOrigins` — e.g.:

```json
"https://samet-karadag.dev"
```

### crossOrigin attribute

All R2 asset consumers already set `crossOrigin = "anonymous"` in the codebase:

- `src/hooks/useAudioAnalyser.ts` — `audio.crossOrigin = "anonymous"` before `audio.src` is assigned
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
○ /              (static)
ƒ /api/chat      (edge function — expected)
```

The `/api/chat` edge-runtime notice is correct and expected — it is the Gemini chatbot route.
