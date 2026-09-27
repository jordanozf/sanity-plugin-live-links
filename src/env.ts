/** Env var for the public site origin (local, staging, production). */
export const LIVE_SITE_URL_ENV = 'SANITY_STUDIO_SITE_URL';

/** Fallback when the same URL is used for Presentation preview. */
export const PREVIEW_URL_ENV = 'SANITY_STUDIO_PREVIEW_URL';

function readEnvUrl(value: string | undefined): string {
	return typeof value === 'string' ? value.trim() : '';
}

/**
 * Resolves the site origin for live links.
 * Uses `baseUrl` when set; otherwise `SANITY_STUDIO_SITE_URL`, then `SANITY_STUDIO_PREVIEW_URL`.
 *
 * Reference env vars with static `process.env.SANITY_STUDIO_*` strings so Sanity can inline them per environment.
 */
export function resolveLiveSiteBaseUrl(explicitBaseUrl?: string): string {
	const fromConfig = readEnvUrl(explicitBaseUrl);
	if (fromConfig) return fromConfig;

	const fromSite = readEnvUrl(process.env.SANITY_STUDIO_SITE_URL);
	if (fromSite) return fromSite;

	const fromPreview = readEnvUrl(process.env.SANITY_STUDIO_PREVIEW_URL);
	if (fromPreview) return fromPreview;

	return '';
}
