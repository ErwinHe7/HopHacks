const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function loadRoute(save) {
  const handlers = {};
  const router = { get() {}, put(route, handler) { handlers[route] = handler; } };
  class Report { constructor(body) { this.body = body; } save() { return save(this.body); } }
  const sandbox = { module: { exports: {} }, require(name) {
    if (name === 'express') return { Router: () => router };
    if (name === '../models/mongo/report') return Report;
    throw new Error('Unexpected dependency: ' + name);
  } };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../routes/report.js'), 'utf8'), sandbox);
  return handlers['/'];
}
function response() { return { code: null, payload: null, status(code) { this.code = code; return this; }, json(payload) { this.payload = payload; } }; }

test('create returns the saved document once persistence succeeds', async () => {
  let saves = 0;
  const body = { title: 'Demo report', website: 'https://example.test', fraudType: 'Phishing' };
  const saved = { ...body, _id: 'report-1' };
  const handler = loadRoute(async received => { saves++; assert.equal(received, body); return saved; });
  const res = response();
  await handler({ body }, res);
  assert.equal(saves, 1);
  assert.equal(res.code, 201);
  assert.equal(res.payload, saved);
});

test('a rejected save does not send a successful response', async () => {
  const handler = loadRoute(async () => { throw new Error('test persistence failure'); });
  const res = response();
  await handler({ body: {} }, res);
  assert.equal(res.code, 500);
});
