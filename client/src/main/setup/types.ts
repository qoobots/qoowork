import type { HtmlShareAccessMode as HtmlShareAccessModeValue, HtmlShareConfigurableStatus, HtmlShareStatus as HtmlShareStatusValue } from '../../shared/htmlShare/constants';
import type { ArtifactFileShareSourceType } from '../libs/htmlShare/artifactFileSharePackager';

// ─── HtmlShare ───

export interface HtmlShareCreateFromHtmlFileInput {
  sessionId: string;
  artifactId: string;
  filePath: string;
  title: string;
  accessMode?: HtmlShareAccessModeValue;
}

export interface HtmlShareUpdateFromHtmlFileInput extends HtmlShareCreateFromHtmlFileInput {
  shareId: string;
  currentStatus?: HtmlShareStatusValue;
}

export interface HtmlShareGetByHtmlFileInput {
  filePath: string;
}

export interface HtmlShareCreateFromArtifactFileInput {
  sourceType: ArtifactFileShareSourceType;
  sessionId: string;
  artifactId: string;
  title: string;
  accessMode?: HtmlShareAccessModeValue;
  fileName?: string;
  filePath?: string;
  content?: string;
  remoteUrl?: string;
}

export interface HtmlShareUpdateFromArtifactFileInput extends HtmlShareCreateFromArtifactFileInput {
  shareId: string;
  currentStatus?: HtmlShareStatusValue;
}

export interface HtmlShareGetByArtifactFileInput {
  sourceType: ArtifactFileShareSourceType;
  sessionId?: string;
  artifactId?: string;
  filePath?: string;
}

export interface HtmlShareUpdateStatusInput {
  shareId: string;
  status: HtmlShareConfigurableStatus;
}

export interface HtmlShareUpdateAccessModeInput {
  shareId: string;
  accessMode: HtmlShareAccessModeValue;
}

// ─── ShareDeployment ───

export interface ShareDeploymentAnalyzeProjectDirectoryInput {
  projectDirectory: string;
  localServiceUrl?: string;
}
