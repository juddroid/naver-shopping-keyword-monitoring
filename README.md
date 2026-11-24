# Naver Shopping Keywords to Google Sheets

Keep a dated Korean ecommerce keyword watchlist without manually paging through Naver DataLab. This tutorial collects **20 skincare category keywords**, compares their ranks with the previous period, and appends recurring snapshots to Google Sheets using an inactive n8n template.

[Try the Naver Shopping Actor](https://apify.com/frank_conifer_af4/naver-shopping-insight?utm_source=github&utm_medium=tutorial&utm_campaign=naver_pilot_20261124&utm_content=english_readme) · [한국어 가이드](README.ko.md) · [JSON sample](samples/skincare-keywords-2026-11-24.json) · [CSV sample](samples/skincare-keywords-2026-11-24.csv)

**This repository is maintained by the Actor's creator.** The Actor is paid per delivered keyword. The tutorial is public; it does not include the Actor's private source code or any credentials. No affiliation with NAVER is claimed.

## Inspect the data first

Collected on **November 24, 2026**, covering **October 25-November 23, 2026**, compared with **September 25-October 24**. A creator-owned validation run returned 20 rows successfully. The public preview contains the first 5 rows; it is not a full live dataset or customer success story.

| Rank | Keyword | Previous rank | Movement |
| --- | --- | --- | --- |
| 1 | ahc아이크림 | 1 | Same |
| 2 | 세포랩 | 2 | Same |
| 3 | 마데카크림 | 3 | Same |

These observations are **category search-keyword click rankings**, not product listings, units sold, absolute search counts, ad performance or a guaranteed opportunity. Korean keyword text is preserved. When a rank stays unchanged, the output says so rather than inventing a rising trend. See [sample provenance](samples/provenance.json).

## First run: no n8n needed

1. Open the [Actor](https://apify.com/frank_conifer_af4/naver-shopping-insight?utm_source=github&utm_medium=tutorial&utm_campaign=naver_pilot_20261124&utm_content=first_run) and use its Input JSON editor.
2. Use [starter-input.json](examples/starter-input.json). It selects skincare, the last 30 days and 20 keywords, with trends, proxies and recurring monitoring explicitly off.
3. Set the maximum charge for the run to **$0.10**, memory to **256 MB**, then start once.
4. Open the dataset and export CSV, Excel or JSON. Check for `status: "ok"`, the returned period and `SUMMARY.stats.errorRows` before using the result.

At the base prices verified on November 24, 20 delivered keywords cost **$0.06005**: `20 x $0.003 + $0.00005` start event. The live Pricing tab is authoritative; taxes, discounts, storage, other platform charges and third-party services are separate. A budget is a cap, not a promise that all requested rows will fit. Failed or empty result rows have no keyword-result fee; a start fee can still apply.

## Daily snapshots in Google Sheets

1. Import [n8n-workflow.json](templates/n8n-workflow.json) into your own n8n instance. It is **inactive** and includes no credentials.
2. In **Run keyword radar**, select an n8n Header Auth credential: `Authorization` with value `Bearer YOUR_APIFY_TOKEN`. Store the real token in the credential store, never in exported JSON, a public sheet, a URL or browser-side code.
3. In **Append to Google Sheets**, connect your own Google credential, replace `YOUR_SPREADSHEET_ID`, and create a tab named `Keywords` with [this header row](templates/sheet-header.csv).
4. Test manually. This establishes a baseline; `runTrend` is `baseline`, not evidence of a new trend. Each subsequent run appends a dated snapshot.
5. Only after verifying delivery, activate the daily schedule at **09:00 Asia/Seoul**, or change it to weekly. Every scheduled run can incur charges even when the same keywords appear. Do not also schedule the same watchlist in Apify.

The request uses a **$0.10 per-run cap**, a 120-second Actor timeout and no automatic HTTP retries. A lost response can leave a run active: inspect your Apify runs before retrying to avoid duplicate charges or sheet rows. Thirty successful top-20 runs would have **$1.80150 in base event charges**, before separate services and any price changes. Nothing in this repository activates a schedule for you.

The first collection uses `monitorChanges: false`; the n8n input uses `monitorChanges: true` and `snapshotStoreName: "my-skincare-keywords"`. Use separate names for independent watchlists, serialize runs of the same watchlist and keep filters stable. Daily checks with `last30days` compare overlapping 30-day windows, not one day's sales. Google Sheets uses `RAW` values so keywords are not executed as formulas.

For Apify-only scheduling or optional Slack alerts, see the [automation guide](templates/automation-guide.md) and [daily-watch input](examples/daily-watch-input.json). Your Google/Slack credentials and destinations are required; this kit's tests do not claim end-to-end delivery into your accounts. Never include webhook secrets in public exports.

## Use this in a data product

Run the collector on a schedule, upsert or archive observations in your own database using category, keyword, filters and collection time, and serve your app from that database. Do not launch a new Actor for every page view. Keep credentials server-side. Treat `previousRank` as previous-period comparison and `lastRunRank` as your own prior snapshot; a keyword newly entering a top-20 list is not a newly launched product.

Change `categories` to your actual research category when useful; category names and paths remain Korean. Confirm source terms and attribution requirements before redistributing data. Public facts in the sample are attributed to [NAVER DataLab Shopping Insight](https://datalab.naver.com/shoppingInsight/sCategory.naver); no source-data ownership or redistribution license is asserted by this tutorial.

## Feedback

If you already use Naver category data for client reporting, describe your workflow in an issue: category, reporting frequency, desired columns and whether the current sample answers your question. Disclose no client information, API keys, private run links or billing details. For private support use the Actor's Store support channel. Purchasing or upgrading a plan is not required to leave feedback; test data and free-account usage are not presented as creator revenue.

## Checks

`node --test test/*.test.mjs` checks the sample structure, inactive workflow, executable code-node snippets, credential placeholders, RAW Sheets handling and request cap. Live collection and sample provenance are recorded separately; these local checks do not execute n8n or create Google Sheets credentials.
