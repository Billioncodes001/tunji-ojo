# Publish from Telegram

Open https://t.me/TunjiOjoJournalBot and press Start. Send `/whoami` to see your numeric Telegram ID. A newsroom administrator links that ID to your active account under **Publishing team → Telegram user ID**. Account names and Telegram usernames do not grant access.

Administrators and editors can publish immediately. Writers can submit drafts for review. Disabling the newsroom account immediately blocks new Telegram submissions. Only private bot chats are accepted; groups, forwarded messages and edits of previous messages do not publish.

Send `/template` for the expected format, `/categories` for section IDs, and `/images` for existing credited photographs. Fill in every field and replace the example source with a real HTTPS source. Send one complete message:

```text
/publish
Title: Your headline
Slug: your-permanent-article-address
Category: institutions
Summary: A concise description for readers and search engines.
Period: The date or period the article covers
Takeaway: The principal finding.
Image: official-portrait

Body:
## The story
Write complete, original paragraphs with at least 60 words across the article.

## Context
Add context and distinguish documented results from promises or targets.

Sources:
Document title | https://publisher.example/document | Date
```

Use `/draft` instead of `/publish` to submit for review. `Slug` defaults to a headline-based address; `Image` is mandatory. `Author` is optional and defaults to `editorial-desk`. Longer articles can be uploaded as UTF-8 `.txt` or `.md` files up to 64 KB, with the same complete format. For a new photograph, use `Image: attached` and add `ImageDescription:`, `ImageCredit:`, `ImageSource:` (HTTPS URL), and `ImageRights:` (permission/licence) before Body. Attach a JPEG, PNG or WebP photo up to 8 MB with the article as its caption. If it does not fit, send the photo first and reply to that photo with the complete article or `.txt` document. The bot uses the largest available photo, stores it in the CMS media library with credits, and assigns it as the article cover. One cover image is supported per article.

The bot returns the public link or a private draft link. The complete article is saved privately before publication. Delivery retries repair interrupted drafts and cannot create duplicate articles. Reusing a slug never overwrites existing content. To correct a live article, use the newsroom and add a correction note where appropriate. A new Telegram message is a new submission, so wait for the receipt before sending again.

The bot validates structure and publishing permissions. It does not verify facts, clear image rights, research sources, or rewrite text. The publishing team remains responsible for editorial review.

## Operator setup

Create a BotFather bot, store `TELEGRAM_BOT_TOKEN` and a random `TELEGRAM_WEBHOOK_SECRET` as Worker secrets, apply the migration, and deploy. Store local copies only in the ignored, mode-600 `.env.telegram.local`. Run `node --import tsx scripts/configure-telegram.ts` after deployment to set commands and the authenticated webhook. Never include bot tokens in logs, commits or public URLs.

The webhook is `/api/telegram/`. It checks Telegram's secret header before reading data, limits request size, uses the linked user's current CMS role and normal collection access controls, and records an internal unique message identifier for duplicate protection. It accepts only new `message` updates. Public post responses omit that identifier.
