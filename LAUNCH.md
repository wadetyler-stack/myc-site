# Going live: muddyyorkcontracting.com → Netlify

The site is deployed at **https://muddyyorkcontracting.netlify.app** (Netlify project `muddyyorkcontracting`, private until you click **Make public** on the project overview).

Email for `dylan@muddyyorkcontracting.com` is hosted at GoDaddy, so **keep DNS at GoDaddy** and change only the two web records below. Do not switch nameservers to Netlify, and do not touch any MX, TXT (SPF/DKIM/DMARC), `autodiscover`, `email` or `_domainconnect` records.

## Before you start
1. In GoDaddy → **My Products → muddyyorkcontracting.com → DNS**, screenshot the full record list so you can put anything back.
2. Netlify → project → **Make public** (otherwise visitors hit a Netlify login wall).

## 1. Add the domain in Netlify
Netlify → `muddyyorkcontracting` → **Domain management → Add a domain** → enter `muddyyorkcontracting.com` → **Verify** → choose **Add domain** (not "Set up Netlify DNS"). Netlify adds `www` automatically and makes the apex the primary domain.

## 2. Turn off the Instagram redirect in GoDaddy
GoDaddy → the domain → **Forwarding** (under DNS or Domain settings) → delete the forwarding rule that sends the domain to Instagram. Forwarding overrides the A record, so this has to go.

## 3. Change two DNS records in GoDaddy
| Type | Name | Value | TTL |
|---|---|---|---|
| A | `@` | `75.2.60.5` | 1 hour |
| CNAME | `www` | `muddyyorkcontracting.netlify.app` | 1 hour |

- If there is more than one `A @` record (GoDaddy's "Parked" or forwarding IPs), edit one and delete the others.
- If `www` already exists as a CNAME pointing to `@`, edit it rather than adding a second one.
- Leave every other record alone, especially **MX** (email).

## 4. HTTPS
Back in Netlify → **Domain management → HTTPS**. Once DNS has propagated (usually under an hour, sometimes up to 24), click **Verify DNS configuration**, then **Provision certificate**. Netlify issues a free Let's Encrypt certificate and forces HTTPS.

## 5. Check
- https://muddyyorkcontracting.com and https://www.muddyyorkcontracting.com both load the new site (www redirects to the apex).
- Send a test email to dylan@muddyyorkcontracting.com and confirm it arrives.
- Submit the contact form once and confirm the notification reaches Dylan. **Dylan must first click the confirmation email Netlify sent him**, or notifications won't send.
- Submit https://muddyyorkcontracting.com/sitemap-index.xml in Google Search Console, and update the website link on Google Business Profile, Facebook and Instagram.
