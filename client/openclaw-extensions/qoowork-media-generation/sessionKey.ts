const LEGACY_qoowork_SESSION_PREFIX = 'qoowork:';
const AGENT_SESSION_PREFIX = 'agent:';
const qoowork_SESSION_MARKER = 'qoowork';

export function isqooworkDesktopSessionKey(sessionKey: string | undefined | null): boolean {
  const raw = (sessionKey ?? '').trim();
  if (!raw) return false;

  if (raw.startsWith(LEGACY_qoowork_SESSION_PREFIX)) {
    return raw.slice(LEGACY_qoowork_SESSION_PREFIX.length).trim().length > 0;
  }

  if (!raw.startsWith(AGENT_SESSION_PREFIX)) {
    return false;
  }

  const parts = raw.split(':');
  if (parts.length < 4 || parts[0] !== 'agent' || parts[2] !== qoowork_SESSION_MARKER) {
    return false;
  }

  const agentId = parts[1]?.trim() ?? '';
  const sessionId = parts.slice(3).join(':').trim();
  return agentId.length > 0 && sessionId.length > 0;
}
