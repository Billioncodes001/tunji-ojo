# Domain launch

The production site remains at https://billioncodes001.github.io/tunji-ojo/ until a domain is purchased and connected. No domain has been purchased by this change.

Cloudflare's public search on 21 September 2026 listed `olubunmitunjiojo.com` for USD 10.46 for one year and USD 10.46/year renewal, before any checkout taxes. Availability and final checkout pricing must be rechecked before payment. The registration flow was opened in a Chrome incognito window and requires the owner's Cloudflare sign-in. Domain choice, spending limit and registrant account are still needed.

## Connection sequence after registration

1. Verify ownership in the GitHub account using the TXT record GitHub supplies. Save the registered hostname as this repository's Pages custom domain before adding hosting DNS records.
2. In Cloudflare DNS, add these DNS-only records (leave unrelated records intact):

| Type | Name | Target |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | billioncodes001.github.io |

3. Set the repository Actions variable `SITE_URL` to `https://REGISTERED-DOMAIN/`. Re-run the deployment. This updates asset paths, canonical metadata, Open Graph and Twitter image URLs, Person structured data, sharing copy, sitemap and robots.txt together.
4. Check GitHub's DNS validation and certificate issuance, then enforce HTTPS. Verify both the apex and www hostname, redirects, all 16 routes, video playback, images and social-card metadata.

GitHub Actions deployments use the Pages custom-domain setting, not a committed CNAME file. DNS and certificate issuance may take up to 24 hours. Do not announce the domain as live until HTTPS and page checks pass.

References: [GitHub custom-domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site), [Cloudflare Registrar](https://www.cloudflare.com/domains/).

## Contact provenance

Checked on 21 September 2026:

- X: `https://x.com/BTOofficial` is linked from `https://bto.ng/`.
- Instagram: `https://www.instagram.com/official_bto/` shows OLUBUNMI TUNJI-OJO, a Verified indicator, the Minister of Interior biography and a link to bto.ng.
- Facebook: `https://www.facebook.com/OlubunmiTunjiOjoBTO` shows Hon. Olubunmi Tunji-Ojo, a Verified account indicator, the Minister of Interior biography and a link to bto.ng.
- Official contact destination: `https://bto.ng/contact/`, linked by the official website. The former unsupported `contact@bto.ng` address was removed.

The website retains its existing independent-profile description until its official status is established. Third-party photographs and video retain their existing publisher attribution and provenance.
