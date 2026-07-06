/**
 * 集中管理所有业务 API 端点。
 * 后续新增的业务接口也应在此文件中配置。
 */

import { configService } from './config';

export const isTestModeEnabled = () => {
  return configService.getConfig().app?.testMode === true;
};

// 自动更新
export const getUpdateCheckUrl = () => isTestModeEnabled()
  ? 'https://api-overmind.qoobot.com/openapi/get/luna/hardware/qoowork/test/update'
  : 'https://api-overmind.qoobot.com/openapi/get/luna/hardware/qoowork/prod/update';

// 手动检查更新
export const getManualUpdateCheckUrl = () => isTestModeEnabled()
  ? 'https://api-overmind.qoobot.com/openapi/get/luna/hardware/qoowork/test/update-manual'
  : 'https://api-overmind.qoobot.com/openapi/get/luna/hardware/qoowork/prod/update-manual';

export const getFallbackDownloadUrl = () => isTestModeEnabled()
  ? 'https://qoowork.inner.qoobot.com/#/download-list'
  : 'https://qoowork.qoobot.com/#/download-list';

// Skill 商店
export const getSkillStoreUrl = () => isTestModeEnabled()
  ? 'https://api-overmind.qoobot.com/openapi/get/luna/hardware/qoowork/test/skill-store'
  : 'https://api-overmind.qoobot.com/openapi/get/luna/hardware/qoowork/prod/skill-store';

// Kit 商店
export const getKitStoreUrl = () => isTestModeEnabled()
  ? 'https://api-overmind.qoobot.com/openapi/get/luna/hardware/qoowork/test/kit-store'
  : 'https://api-overmind.qoobot.com/openapi/get/luna/hardware/qoowork/prod/kit-store';

// 登录地址
export const getLoginOvermindUrl = () => isTestModeEnabled()
  ? 'https://api-overmind.qoobot.com/openapi/get/luna/hardware/qoowork/test/login-url'
  : 'https://api-overmind.qoobot.com/openapi/get/luna/hardware/qoowork/prod/login-url';

// Portal 页面
const PORTAL_BASE_TEST = 'https://qoowork.inner.qoobot.com/portal#';
const PORTAL_BASE_PROD = 'https://qoowork.qoobot.com/portal#';

const getPortalBase = () => isTestModeEnabled() ? PORTAL_BASE_TEST : PORTAL_BASE_PROD;

export const PortalPricingKeyfrom = {
  HtmlShare: 'html_share',
} as const;

export type PortalPricingKeyfrom =
  (typeof PortalPricingKeyfrom)[keyof typeof PortalPricingKeyfrom];

export const getPortalLoginUrl = () => `${getPortalBase()}/login`;
export const getPortalPricingUrl = (keyfrom?: PortalPricingKeyfrom) => (
  `${getPortalBase()}/pricing${keyfrom ? `?keyfrom=${encodeURIComponent(keyfrom)}` : ''}`
);
export const getPortalProfileUrl = () => `${getPortalBase()}/profile`;
export const getPortalRechargeUrl = () => `${getPortalBase()}/`;
export const getPortalInvitationUrl = () => `${getPortalBase()}/invitation`;
export const getPortalCreditsResetActivityUrl = () => `${getPortalBase()}/profile?activity=credits_reset`;
