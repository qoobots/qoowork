import { app } from 'electron';

import { HtmlSharePublicRoute } from '../../shared/htmlShare/constants';
import type { SqliteStore } from '../sqliteStore';

let cachedTestMode: boolean | null = null;

/**
 * Read testMode from store and cache it.
 * Call once at startup and again whenever app_config changes.
 */
export function refreshEndpointsTestMode(store: SqliteStore): void {
  const appConfig = store.get<any>('app_config');
  cachedTestMode = appConfig?.app?.testMode === true;
}

/**
 * Whether the app is in test mode.
 * Uses cached value after init; falls back to !app.isPackaged before init.
 */
export const isTestModeEnabled = (): boolean => {
  return cachedTestMode ?? !app.isPackaged;
};

/**
 * Server API base URL — switches based on testMode.
 * Used for auth exchange/refresh, models, proxy, etc.
 */
export const getServerApiBaseUrl = (): string => {
  return isTestModeEnabled()
    ? 'https://qoowork-server.inner.qoobot.com'
    : 'https://qoowork-server.qoobot.com';
};

export const getHtmlSharePublicBaseUrl = (): string => {
  return `${getServerApiBaseUrl()}${HtmlSharePublicRoute.Root}`;
};

export const getUpdateCheckUrl = (): string => (
  isTestModeEnabled()
    ? 'https://api-overmind.qoobot.com/openapi/get/luna/hardware/qoowork/test/update'
    : 'https://api-overmind.qoobot.com/openapi/get/luna/hardware/qoowork/prod/update'
);

export const getManualUpdateCheckUrl = (): string => (
  isTestModeEnabled()
    ? 'https://api-overmind.qoobot.com/openapi/get/luna/hardware/qoowork/test/update-manual'
    : 'https://api-overmind.qoobot.com/openapi/get/luna/hardware/qoowork/prod/update-manual'
);

export const getFallbackDownloadUrl = (): string => (
  isTestModeEnabled()
    ? 'https://qoowork.inner.qoobot.com/#/download-list'
    : 'https://qoowork.qoobot.com/#/download-list'
);

export const getSkillStoreUrl = (): string => (
  isTestModeEnabled()
    ? 'https://api-overmind.qoobot.com/openapi/get/luna/hardware/qoowork/test/skill-store'
    : 'https://api-overmind.qoobot.com/openapi/get/luna/hardware/qoowork/prod/skill-store'
);

// Portal 页面
const PORTAL_BASE_TEST = 'https://qoowork.inner.qoobot.com/portal#';
const PORTAL_BASE_PROD = 'https://qoowork.qoobot.com/portal#';

const getPortalBase = (): string => isTestModeEnabled() ? PORTAL_BASE_TEST : PORTAL_BASE_PROD;

export const getPortalTasksUrl = (): string => `${getPortalBase()}/profile/detail?tab=tasks`;

export const getKitStoreUrl = (): string => (
  isTestModeEnabled()
    ? 'https://api-overmind.qoobot.com/openapi/get/luna/hardware/qoowork/test/kit-store'
    : 'https://api-overmind.qoobot.com/openapi/get/luna/hardware/qoowork/prod/kit-store'
);
