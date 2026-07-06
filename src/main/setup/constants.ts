import { ShareDeploymentCandidateSource } from '../../shared/shareDeployment/constants';

// ─── IPC safetynet limits ───
export const IPC_MESSAGE_CONTENT_MAX_CHARS = 120_000;
export const IPC_UPDATE_CONTENT_MAX_CHARS = 120_000;
export const IPC_STRING_MAX_CHARS = 4_000;
export const IPC_MAX_DEPTH = 5;
export const IPC_MAX_KEYS = 80;
export const IPC_MAX_ITEMS = 40;
export const MAX_INLINE_ATTACHMENT_BYTES = 25 * 1024 * 1024;
export const MAX_ARTIFACT_SHARE_CONTENT_CHARS = 30 * 1024 * 1024;

// ─── Share deployment ───
export const SHARE_DEPLOYMENT_PROJECT_CANDIDATE_MAX_ITEMS = 24;
export const SHARE_DEPLOYMENT_CANDIDATE_SOURCES = new Set<string>(
  Object.values(ShareDeploymentCandidateSource),
);

// ─── Misc business constants ───
export const ENGINE_NOT_READY_CODE = 'ENGINE_NOT_READY';
export const INVALID_FILE_NAME_PATTERN = /[<>:"/\\|?*\u0000-\u001F]/g;

// ─── Memory limits ───
export const MIN_MEMORY_USER_MEMORIES_MAX_ITEMS = 1;
export const MAX_MEMORY_USER_MEMORIES_MAX_ITEMS = 60;

// ─── Local web service probing ───
export const LOCAL_WEB_SERVICE_PROBE_TIMEOUT_MS = 700;
export const LOCAL_WEB_SERVICE_TITLE_MAX_LENGTH = 80;
export const LOCAL_WEB_SERVICE_PORTS = Array.from(
  new Set([
    3000, 3001, 3002, 3003, 3004, 3005, 3006, 3007, 3008, 3009, 3010, 3333, 4000, 4173, 5000, 5173,
    5174, 5175, 5176, 5177, 5178, 5179, 5180, 8000, 8080, 8081, 8888,
  ]),
).sort((a, b) => a - b);

// ─── Power save ───
export const PowerSaveBlockerType = {
  PreventAppSuspension: 'prevent-app-suspension',
} as const;

// ─── MIME extension map ───
export const MIME_EXTENSION_MAP: Record<string, string> = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'image/bmp': '.bmp',
  'application/pdf': '.pdf',
  'text/plain': '.txt',
  'text/markdown': '.md',
  'application/json': '.json',
  'text/csv': '.csv',
};

// ─── OpenClaw log rotation ───
export const OPENCLAW_DAILY_LOG_RETENTION_DAYS = 7;
export const OPENCLAW_DAILY_LOG_RE = /^openclaw-\d{4}-\d{2}-\d{2}\.log$/;

// ─── Auth ───
export const AUTH_USER_STORE_KEY = 'auth_user';
