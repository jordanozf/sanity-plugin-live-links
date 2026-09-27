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

export type LiveLinksPluginConfig = {
	/** Public site origin or base URL, e.g. https://example.com */
	baseUrl: string;
	/** Document schema type names that show the panel */
	documentTypes: string[];
	/** Locale-specific path prefixes */
	locales: LiveLinkLocale[];
	/** Resolve locale-neutral path (/about). Return null when links are unavailable. */
	resolvePath: (context: LiveLinksPathContext) => string | null;
	/** Form path to slug.current (default: ['slug', 'current']) */
	slugPath?: Path;
	/** Form path to title field (default: ['title']) */
	titlePath?: Path;
	/** Parse title from form value (e.g. internationalized arrays) */
	resolveTitle?: (context: LiveLinksTitleContext) => string;
	/** Show placeholder when slug is missing for these types */
	requiresSlug?: string[];
	/** Accordion label prefix (default: Live links) */
	panelTitle?: string;
};

export type LiveSiteUrlHelpers = {
	siteOrigin: () => string;
	liveSiteUrl: (localeId: string, path: string) => string;
	liveSiteLinksForPath: (path: string) => Array<{ locale: string; path: string; url: string }>;
};
