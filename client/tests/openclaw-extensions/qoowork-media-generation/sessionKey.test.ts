import { describe, expect, test } from 'vitest';

import { isqooworkDesktopSessionKey } from '../../../openclaw-extensions/qoowork-media-generation/sessionKey';

describe('qoowork-media-generation session key gating', () => {
  test('allows main agent desktop sessions', () => {
    expect(isqooworkDesktopSessionKey('agent:main:qoowork:session-1')).toBe(true);
  });

  test('allows non-main agent desktop sessions', () => {
    expect(isqooworkDesktopSessionKey('agent:creative-agent:qoowork:session-2')).toBe(true);
  });

  test('allows legacy desktop sessions', () => {
    expect(isqooworkDesktopSessionKey('qoowork:session-3')).toBe(true);
  });

  test('rejects channel and malformed session keys', () => {
    expect(isqooworkDesktopSessionKey('agent:creative-agent:dingtalk-connector:direct:user-1')).toBe(false);
    expect(isqooworkDesktopSessionKey('')).toBe(false);
    expect(isqooworkDesktopSessionKey('agent::qoowork:session-4')).toBe(false);
    expect(isqooworkDesktopSessionKey('agent:creative-agent:qoowork:')).toBe(false);
    expect(isqooworkDesktopSessionKey('agent:creative-agent')).toBe(false);
  });
});
