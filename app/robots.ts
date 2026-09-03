import type { MetadataRoute } from "next";

const SITE_URL = "https://sametkaradag.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      /* The chat endpoint is a POST-only edge function — nothing to crawl. */
      disallow: "/api/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
