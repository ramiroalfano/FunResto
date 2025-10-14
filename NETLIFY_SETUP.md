Netlify setup and secrets

1) Do NOT commit serviceAccountKey.json to the repository. Keep it locally and add it to .gitignore.

2) Provide the Firebase service account to CI (Netlify) using an environment variable named SERVICE_ACCOUNT_KEY.
   - You can paste the JSON directly or base64-encode it.
   - Example (base64):
     $ cat serviceAccountKey.json | base64 | pbcopy
     Then paste the base64 into Netlify env var SERVICE_ACCOUNT_KEY.

3) Required environment variables (set these in Netlify → Site settings → Build & deploy → Environment):
   - NEXT_PUBLIC_FIREBASE_API_KEY
   - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
   - NEXT_PUBLIC_FIREBASE_PROJECT_ID
   - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
   - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
   - NEXT_PUBLIC_FIREBASE_APP_ID
   - NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID (optional)
   - MERCADOPAGO_ACCESS_TOKEN (if you use MercadoPago endpoints)
   - NEXT_PUBLIC_BASE_URL (your site URL)
   - SERVICE_ACCOUNT_KEY (base64 or JSON string) — used for firebase-admin in scripts/functions during build or server runtime

4) After adding env vars, retry the deploy.

5) Local testing:
   - Export the env vars locally (PowerShell example):
     $env:SERVICE_ACCOUNT_KEY = Get-Content .\\serviceAccountKey.json -Raw
     $env:NEXT_PUBLIC_FIREBASE_API_KEY = "your_key"
   - Then run:
     npm run build

6) Security:
   - Rotate service account keys if they were committed accidentally.
   - Prefer restricting service account roles to least privilege.
