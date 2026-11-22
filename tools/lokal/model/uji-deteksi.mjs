import assert from 'node:assert/strict';
import test from 'node:test';
import {
  aplikasiDariEnv,
  namaPlatform,
  namaProvider,
  pecahModel,
  platformUntuk,
} from './deteksi.mjs';

test('model dengan namespace provider dikenali', () => {
  assert.deepEqual(pecahModel('deepseek/deepseek-v4.1-flash'), {
    model: 'deepseek-v4.1-flash',
    provider: 'DeepSeek',
  });
});

test('namespace aplikasi menang atas vendor', () => {
  assert.deepEqual(pecahModel('commandcode/deepseek/deepseek-v4.1-flash'), {
    model: 'deepseek-v4.1-flash',
    provider: 'CommandCode',
  });
});

test('namespace tak dikenal dilewati, vendor tetap dikenali', () => {
  assert.deepEqual(pecahModel('cmc/deepseek/deepseek-v4.1-flash'), {
    model: 'deepseek-v4.1-flash',
    provider: 'DeepSeek',
  });
  assert.deepEqual(pecahModel('cmc/deepseek-v4.1-flash'), {
    model: 'deepseek-v4.1-flash',
    provider: 'cmc',
  });
});

test('model tanpa namespace tidak punya provider', () => {
  assert.deepEqual(pecahModel('deepseek-v4.1-flash'), {
    model: 'deepseek-v4.1-flash',
    provider: null,
  });
});

test('platform hanya dari aplikasi sumber, bukan provider', () => {
  assert.equal(platformUntuk('zed threads'), 'Zed');
  assert.equal(platformUntuk('opencode session'), 'opencode');
  assert.equal(platformUntuk('copilot session-state'), 'GitHub Copilot');
  assert.equal(platformUntuk('9router usageHistory'), null);
});

test('aplikasi dibaca dari env terminal', () => {
  assert.equal(aplikasiDariEnv({ TERM_PROGRAM: 'zed' }), 'Zed');
  assert.equal(aplikasiDariEnv({ TERM_PROGRAM: 'vscode' }), 'VS Code');
  assert.equal(aplikasiDariEnv({ ZED_TERM: '1' }), 'Zed');
  assert.equal(aplikasiDariEnv({ VSCODE_PID: '123' }), 'VS Code');
  assert.equal(aplikasiDariEnv({}), null);
});

test('pemetaan nama platform dan provider', () => {
  assert.equal(namaPlatform('CommandCode'), 'CommandCode');
  assert.equal(namaPlatform('command code'), 'CommandCode');
  assert.equal(namaPlatform('tidak-dikenal'), 'tidak-dikenal');
  assert.equal(namaProvider('google'), 'Google');
  assert.equal(namaProvider('command code'), 'CommandCode');
  assert.equal(namaProvider(null), null);
});
