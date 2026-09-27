export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			SANITY_STUDIO_SITE_URL?: string;
			SANITY_STUDIO_PREVIEW_URL?: string;
		}
	}
}
