Deployment checklist & quick steps

1) Configuration
- Create production env (do not commit):

  VITE_API_URL=https://api.example.com

2) Build locally

  npm ci
  npm run build

3) Docker (staging with docker-compose)

  # from the frontend repo
  docker-compose build
  docker-compose up

4) Production notes
- Use HTTPS (reverse proxy / load balancer)
- Ensure backend handles `images` multipart uploads and returns a single PDF blob
- Set appropriate resource limits, rate-limits and monitoring

Netlify specific
----------------

If you want to deploy the frontend to Netlify (static hosting), the repo already includes `netlify.toml` with the build command and an SPA redirect. Steps:

1. Push your repository to GitHub (or Git provider) and connect it from Netlify (New site -> Import from Git).
2. In Netlify UI set the build command to `npm run build` and the publish directory to `dist` (these are the defaults from `netlify.toml`).
3. In Site settings -> Build & deploy -> Environment -> Add variable `VITE_API_URL` pointing to your backend public URL (e.g. `https://api.example.com`).
4. Deploy the site. Netlify will build and publish automatically on push.

Optional: to deploy manually from your machine using Netlify CLI:

```bash
npm run build
npx netlify deploy --prod --dir=dist
```

Notes:
- The backend must be publicly reachable (HTTPS) and accept `images` multipart form uploads. Netlify will only host the frontend; your backend stays where it is.
- If your backend is on `localhost` during testing, keep using docker-compose or expose it via a tunnel (ngrok) for Netlify to reach it in staging.


5) CI/CD
- The repository contains a basic GitHub Actions workflow in `.github/workflows/ci.yml` that runs lint + build.

6) Troubleshooting
- If you get 500 from backend, check backend container logs:

  docker-compose logs -f backend
