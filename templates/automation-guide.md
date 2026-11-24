# Naver Shopping skincare automation kit

## Choose one scheduler

- Apify-only: copy DAILY_WATCH_INPUT into the Actor's Input tab, save it as your own task, then attach a daily or weekly Apify schedule. For Slack, add your own incoming webhook URL as webhookUrl. No n8n account is required.
- n8n + Google Sheets: download N8N_WORKFLOW as JSON, import it into your own n8n instance, and follow the setup below. Do not also schedule the same watchlist in Apify: that would run and charge twice.

## n8n setup

1. Import N8N_WORKFLOW. It is inactive and contains no credentials.
2. In Run keyword radar, select a Header Auth credential. Header name: Authorization. Header value: Bearer followed by a space and your own Apify API token. Keep the token in n8n's credential store, not in the URL, input, or exported workflow.
3. Select your own Google Sheets OAuth credential in Append to Google Sheets. Replace YOUR_SPREADSHEET_ID with the target document ID. Create a tab named Keywords with this header row:

~~~csv
collectedAt,categoryPath,rank,keyword,previousRank,rankChange,rankTrend,lastRunRank,runRankChange,runTrend,breakoutScore,breakoutSignal,naverShoppingUrl
~~~

4. Test manually once. This establishes the baseline; lastRunRank is empty and runTrend is baseline. Confirm rows reach the sheet. Each later run appends a dated snapshot; it does not overwrite earlier rows.
5. For optional Slack alerts, add webhookUrl to the object in Watchlist input using your own Slack incoming webhook URL. This is a secret: do not publish the workflow or share execution data containing it. The Actor sends alerts directly; no Slack node is needed. Baseline and unchanged runs send no alert. Slack may succeed even if a later Sheets append fails.
6. Publish or activate the workflow only after the manual test. Its schedule is 09:00 Asia/Seoul. API requests are limited to $0.10 per run, 256 MB, and a 120-second Actor timeout. No automatic request retries are enabled: a lost response can leave an Actor running. Check the Apify run before retrying to avoid duplicate charges or sheet rows.

## Cost and monitoring

At current base event prices, this 1-category top-20 watchlist costs up to $0.06005 per successful run without trends or proxies. Prices can change: the live Store Pricing tab is authoritative. Optional platform, storage, n8n, Google, Slack or other service costs are not included. If you add categories or increase maxRank, review both pricing and the request budget.

Keep the same snapshotStoreName, filters and maxRank across runs. Use a different snapshotStoreName for an independent workflow, and avoid simultaneous runs using the same store. A newly appearing keyword means new to the tracked top N, not a newly launched product. Named snapshot storage must be permitted for cross-run comparison. Check SUMMARY.monitoring.enabled; if permissions prevent access, use a saved task with suitable storage access. Daily checks using last30days compare overlapping windows, not daily sales.

## Data boundaries

These are public aggregated Naver DataLab Shopping Insight rankings, not sales, absolute search counts, marketplace product positions, prices or inventory. Keywords stay in Korean. Google Sheets receives the selected keyword fields; Slack receives change summaries only when webhookUrl is set. The Sheets node uses RAW values so a keyword beginning with = is stored as text, not executed as a formula.

The workflow structure and row mapping are automatically tested; end-to-end Google/Slack delivery requires your own credentials and destination. Never embed your Apify token in a public sheet or public workflow.
