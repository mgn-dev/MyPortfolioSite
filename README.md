This is a [Next.js](https://nextjs.org) portfolio site. Content is loaded from [PocketBase](https://pocketbase.io) when configured, with a static fallback in `src/content/site.ts`.

## PocketBase (Dokploy)

1. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_POCKETBASE_URL` to your PocketBase API base URL (HTTPS, no trailing slash).
2. Bootstrap collections and seed data (admin credentials only — not used by the app):

```bash
POCKETBASE_URL=https://your-pocketbase.example.com \
POCKETBASE_ADMIN_EMAIL=you@example.com \
POCKETBASE_ADMIN_PASSWORD=your-admin-password \
npm run setup:pocketbase
```

If the server uses a temporary/self-signed TLS certificate, add `POCKETBASE_INSECURE_SKIP_TLS=true` for the setup command only.

3. Edit content in the PocketBase admin UI (`/_/`) under **site_profile**, **socials**, and **projects**.
4. Upload **profileImage** on `site_profile` and optional **image** on each project.

### Dokploy checklist

**PocketBase compose**

- Domain: HTTPS enabled (Let's Encrypt).
- **Isolated deployment:** off (or add `traefik.docker.network=<appName>` to the service).
- After changing domains, redeploy the compose stack.

**PocketBase CORS**

- Not required for this portfolio: Next.js fetches PocketBase **on the server**, so the browser never calls the PocketBase API directly.
- PocketBase also allows all origins by default (`*`). There is no CORS setting in the admin UI (`/_/`).
- Only if you later add browser-side PocketBase requests would you restrict origins via the PocketBase `--origins` startup flag in the compose service.

**Portfolio Next.js app** (new Dokploy application)

- Build: `npm run build` / Start: `npm run start` (or Nixpacks).
- Environment:
  - `NEXT_PUBLIC_POCKETBASE_URL` — public HTTPS URL for PocketBase (e.g. `https://cms.madebymgn.co.za`)
  - `POCKETBASE_URL` — internal HTTP URL for server-side fetches (e.g. `http://myportfolioshowcase-pocketbase-svvnbg-pocketbase-1:8090` on Dokploy)
  - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` — for the contact form

**PocketBase custom domain (recommended)**

- Add `cms.madebymgn.co.za` as a domain on the PocketBase compose service (HTTPS / Let's Encrypt).
- In Cloudflare, add a proxied DNS record for `cms` pointing to your server (same as the main site).
- Redeploy the PocketBase compose stack after adding the domain.

**Contact form**

- Recipient email is read from `site_profile.contactEmail` in PocketBase (not from the form).
- WhatsApp number is read from `site_profile.contactWhatsapp` and shown as a `wa.me` link.

## Getting Started

```bash
cp .env.example .env.local
# edit .env.local

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Collections

| Collection     | Purpose |
|----------------|---------|
| `site_profile` | Name, role, bio, initials, profile image, contact email & WhatsApp |
| `socials`      | Social links (sort order) |
| `projects`     | Project cards (`category`: `software-engineering` or `cybersecurity`) |

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [PocketBase Documentation](https://pocketbase.io/docs/)
