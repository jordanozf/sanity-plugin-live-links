import { resolveLiveSiteBaseUrl } from './env';
import type { LiveLinksPluginConfig, LiveSiteUrlHelpers } from './types';

function parseOrigin(baseUrl: string) {
	const raw = baseUrl.trim();
	if (!raw) return '';
	try {
		return new URL(raw).origin;
	} catch {
		return raw.replace(/\/$/, '');
	}
}

export function createLiveSiteUrlHelpers(
	config: Pick<LiveLinksPluginConfig, 'baseUrl' | 'locales'>
): LiveSiteUrlHelpers {
	const origin = parseOrigin(resolveLiveSiteBaseUrl(config.baseUrl));
	const localeById = new Map(config.locales.map((locale) => [locale.id, locale]));

	function liveSiteUrl(localeId: string, path: string) {
		const locale = localeById.get(localeId);
		if (!locale) return path;
		const localized = locale.localizePath(path);
		return origin ? `${origin}${localized}` : localized;
	}

	function liveSiteLinksForPath(path: string) {
		return config.locales.map((locale) => ({
			locale: locale.id,
			path: locale.localizePath(path),
			url: liveSiteUrl(locale.id, path)
		}));
	}

	return {
		siteOrigin: () => origin,
		liveSiteUrl,
		liveSiteLinksForPath
	};
}
