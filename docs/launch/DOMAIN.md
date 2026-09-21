# Domain launch

The user registered **olubunmitunjiojo.com** through Cloudflare on 21 September 2026. The production address is configured as https://olubunmitunjiojo.com/; www is configured to follow the apex through GitHub Pages.

## Hosting configuration

- Registrar and DNS: Cloudflare.
- Hosting: GitHub Pages, repository `Billioncodes001/tunji-ojo`.
- Pages custom domain: `olubunmitunjiojo.com`.
- Actions variable `SITE_URL`: `https://olubunmitunjiojo.com/`.
- Deployment automatically runs browser checks for both the GitHub project path and a root domain, then builds the configured production address.
- All asset paths, canonical URLs, social images, structured data, sharing copy, robots.txt and sitemap derive from that address.

Cloudflare DNS records (DNS only):

| Type | Name | Target |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | billioncodes001.github.io |
| TXT | _github-pages-challenge-billioncodes001 | GitHub account verification record; retain it |

GitHub Actions deployments use the Pages custom-domain setting rather than a committed CNAME file. After changing hosting or DNS, recheck certificate issuance and HTTPS enforcement, the apex and www redirect, all 16 routes, the video, and social-card metadata. DNS and certificate issuance can take up to 24 hours.

References: [GitHub custom-domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site), [Cloudflare Registrar](https://www.cloudflare.com/domains/).

## Contact provenance

Checked on 21 September 2026:

- X: `https://x.com/BTOofficial` is linked from `https://bto.ng/`.
- Instagram: `https://www.instagram.com/official_bto/` shows OLUBUNMI TUNJI-OJO, a Verified indicator, the Minister of Interior biography and a link to bto.ng.
- Facebook: `https://www.facebook.com/OlubunmiTunjiOjoBTO` shows Hon. Olubunmi Tunji-Ojo, a Verified account indicator, the Minister of Interior biography and a link to bto.ng.
- Official contact destination: `https://bto.ng/contact/`, linked by the official website. The former unsupported `contact@bto.ng` address was removed.

The website retains its existing independent-profile description until its official status is established. Third-party photographs and video retain their existing publisher attribution and provenance.
