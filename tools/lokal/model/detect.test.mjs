import assert from 'node:assert/strict';
import test from 'node:test';
import {
  aplikasiDariEnv,
  namaPlatform,
  namaProvider,
  pecahModel,
  platformUntuk,
} from './detect.mjs';

test('model with a provider namespace is recognised', () => {
  assert.deepEqual(pecahModel('deepseek/deepseek-v4.1-flash'), {
    model: 'deepseek-v4.1-flash',
    provider: 'DeepSeek',
  });
});

test('app namespace wins over the vendor', () => {
  assert.deepEqual(pecahModel('commandcode/deepseek/deepseek-v4.1-flash'), {
    model: 'deepseek-v4.1-flash',
    provider: 'CommandCode',
  });
});

test('unknown namespace is skipped, vendor still recognised', () => {
  assert.deepEqual(pecahModel('cmc/deepseek/deepseek-v4.1-flash'), {
    model: 'deepseek-v4.1-flash',
    provider: 'DeepSeek',
  });
  assert.deepEqual(pecahModel('cmc/deepseek-v4.1-flash'), {
    model: 'deepseek-v4.1-flash',
    provider: 'cmc',
  });
});

test('model without a namespace has no provider', () => {
  assert.deepEqual(pecahModel('deepseek-v4.1-flash'), {
    model: 'deepseek-v4.1-flash',
    provider: null,
  });
});

test('platform comes only from the source app, not the provider', () => {
  assert.equal(platformUntuk('zed threads'), 'Zed');
  assert.equal(platformUntuk('opencode session'), 'opencode');
  assert.equal(platformUntuk('copilot session-state'), 'GitHub Copilot');
  assert.equal(platformUntuk('9router usageHistory'), null);
});

test('host app is read from terminal env', () => {
  assert.equal(aplikasiDariEnv({ TERM_PROGRAM: 'zed' }), 'Zed');
  assert.equal(aplikasiDariEnv({ TERM_PROGRAM: 'vscode' }), 'VS Code');
  assert.equal(aplikasiDariEnv({ ZED_TERM: '1' }), 'Zed');
  assert.equal(aplikasiDariEnv({ VSCODE_PID: '123' }), 'VS Code');
  assert.equal(aplikasiDariEnv({}), null);
});

test('platform and provider name mapping', () => {
  assert.equal(namaPlatform('CommandCode'), 'CommandCode');
  assert.equal(namaPlatform('command code'), 'CommandCode');
  assert.equal(namaPlatform('tidak-dikenal'), 'tidak-dikenal');
  assert.equal(namaProvider('google'), 'Google');
  assert.equal(namaProvider('command code'), 'CommandCode');
  assert.equal(namaProvider(null), null);
});
