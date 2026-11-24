import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

const read = async file => JSON.parse(await readFile(new URL(`../${file}`, import.meta.url), 'utf8'));
test('dated sample is successful public ranking data, not invented growth', async () => {
    const rows = await read('samples/skincare-keywords-2026-11-24.json');
    const provenance = await read('samples/provenance.json');
    assert.equal(rows.length, 5);
    assert.equal(provenance.validatedResultCount, 20);
    assert.equal(provenance.publishedPreviewCount, rows.length);
    assert.ok(rows.every(row => row.startDate === '2026-10-25' && row.endDate === '2026-11-23'));
    assert.ok(rows.every(row => row.rankChange !== 0 || row.rankTrend === 'same'));
    assert.ok(rows.every(row => new URL(row.datalabKeywordUrl).hostname === 'datalab.naver.com'));
});
test('workflow uses safe credentials, bounded requests and no automatic paid schedule', async () => {
    const workflow = await read('templates/n8n-workflow.json');
    assert.equal(workflow.active, false);
    assert.equal(workflow.settings.timezone, 'Asia/Seoul');
    assert.ok(workflow.nodes.every(node => !node.credentials));
    const request = workflow.nodes.find(node => node.name === 'Run keyword radar');
    assert.equal(request.parameters.authentication, 'genericCredentialType');
    assert.equal(request.parameters.genericAuthType, 'httpHeaderAuth');
    assert.equal(request.retryOnFail, false);
    assert.equal(request.parameters.queryParameters.parameters.find(p => p.name === 'maxTotalChargeUsd').value, '0.1');
    assert.equal(workflow.nodes.find(node => node.name === 'Append to Google Sheets').parameters.options.cellFormat, 'RAW');
    for (const node of workflow.nodes.filter(node => node.type === 'n8n-nodes-base.code')) new Function('$input', node.parameters.jsCode);
    const actual = new Function(workflow.nodes.find(node => node.name === 'Watchlist input').parameters.jsCode)();
    assert.deepEqual(actual, [{ json: await read('examples/daily-watch-input.json') }]);
});
test('starter input and link attribution accurately describe what is and is not measured', async () => {
    const starter = await read('examples/starter-input.json');
    assert.deepEqual(starter.categories, ['스킨케어']);
    assert.equal(starter.maxRank, 20);
    for (const field of ['includeTrend', 'includeAudienceBreakdown', 'monitorChanges']) assert.equal(starter[field], false);
    const links = await read('links.json');
    assert.equal(new URL(links.tutorial).searchParams.get('utm_campaign'), 'naver_pilot_20261124');
    assert.match(links.attributionNote, /do not implement a click tracker/);
});
