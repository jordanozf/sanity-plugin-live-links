import type { Path } from 'sanity';

export type LiveLinkLocale = {
	id: string;
	localizePath: (path: string) => string;
};

export type LiveLinksPathContext = {
	documentType: string;
	slug?: string;
};

export type LiveLinksTitleContext = LiveLinksPathContext & {
	titleValue: unknown;
};

/** Per document type — define each type once under `documents` in plugin config. */
export type LiveLinksDocumentConfig = {
	/** Fixed locale-neutral path, or a function (e.g. from slug). */
	path: string | ((context: LiveLinksPathContext) => string | null);
	/** When true, the panel shows — until a slug is present. */
	requiresSlug?: boolean;
	slugPath?: Path;
	titlePath?: Path;
	/** Fallback label when `resolveTitle` is not set */
	title?: string;
	resolveTitle?: (context: LiveLinksTitleContext) => string;
};

export type LiveLinksPluginConfig = {
	/**
	 * Public site origin (e.g. `https://example.com`).
	 * Omit to use `SANITY_STUDIO_SITE_URL`, or `SANITY_STUDIO_PREVIEW_URL` as fallback.
	 */
	baseUrl?: string;
	/** One entry per schema type that should show live links (keys = `_type` names). */
	documents: Record<string, LiveLinksDocumentConfig>;
	locales: LiveLinkLocale[];
	slugPath?: Path;
	titlePath?: Path;
	resolveTitle?: (context: LiveLinksTitleContext) => string;
	panelTitle?: string;
};

export type ResolvedLiveLinksPluginConfig = LiveLinksPluginConfig & {
	baseUrl: string;
	documentTypeNames: string[];
	resolvePath: (context: LiveLinksPathContext) => string | null;
	requiresSlug: (documentType: string) => boolean;
	slugPathFor: (documentType: string) => Path;
	titlePathFor: (documentType: string) => Path;
	resolveTitleFor: (context: LiveLinksTitleContext) => string;
};

export type LiveSiteUrlHelpers = {
	siteOrigin: () => string;
	liveSiteUrl: (localeId: string, path: string) => string;
	liveSiteLinksForPath: (path: string) => Array<{ locale: string; path: string; url: string }>;
};
