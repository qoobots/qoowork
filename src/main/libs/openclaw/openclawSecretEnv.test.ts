import { describe, expect, test } from 'vitest';

import { collectReferencedEnvVarNames, pickReferencedSecretEnvVars } from './openclawSecretEnv';

describe('collectReferencedEnvVarNames', () => {
  test('extracts OpenClaw env placeholders from serialized config', () => {
    const refs = collectReferencedEnvVarNames({
      models: {
        providers: {
          openai: { apiKey: '${QOOWORK_APIKEY_OPENAI}' },
          server: { apiKey: '${QOOWORK_PROXY_TOKEN}' },
        },
      },
      ignored: '${not-uppercase}',
    });

    expect([...refs].sort()).toEqual([
      'QOOWORK_APIKEY_OPENAI',
      'QOOWORK_PROXY_TOKEN',
    ]);
  });
});

describe('pickReferencedSecretEnvVars', () => {
  test('ignores dynamic secrets that are not referenced by openclaw config', () => {
    const referenced = new Set(['QOOWORK_PROXY_TOKEN']);

    const before = pickReferencedSecretEnvVars({
      QOOWORK_APIKEY_SERVER: 'old-access-token',
      QOOWORK_PROXY_TOKEN: 'stable-proxy-token',
    }, referenced);
    const after = pickReferencedSecretEnvVars({
      QOOWORK_APIKEY_SERVER: 'new-access-token',
      QOOWORK_PROXY_TOKEN: 'stable-proxy-token',
    }, referenced);

    expect(before).toEqual({ QOOWORK_PROXY_TOKEN: 'stable-proxy-token' });
    expect(JSON.stringify(before)).toBe(JSON.stringify(after));
  });

  test('keeps referenced secret changes visible for restart decisions', () => {
    const referenced = new Set(['QOOWORK_APIKEY_OPENAI']);

    const before = pickReferencedSecretEnvVars({
      QOOWORK_APIKEY_OPENAI: 'sk-old',
      QOOWORK_APIKEY_SERVER: 'old-access-token',
    }, referenced);
    const after = pickReferencedSecretEnvVars({
      QOOWORK_APIKEY_OPENAI: 'sk-new',
      QOOWORK_APIKEY_SERVER: 'new-access-token',
    }, referenced);

    expect(JSON.stringify(before)).not.toBe(JSON.stringify(after));
  });
});
