import { resolveLiveSiteBaseUrl } from './env';
import type { Path } from 'sanity';
import type {
	LiveLinksPathContext,
	LiveLinksPluginConfig,
	ResolvedLiveLinksPluginConfig
} from './types';

const DEFAULT_SLUG_PATH: Path = ['slug', 'current'];
const DEFAULT_TITLE_PATH: Path = ['title'];

function resolveDocumentPath(
	path: LiveLinksPluginConfig['documents'][string]['path'],
	context: LiveLinksPathContext
): string | null {
	if (typeof path === 'string') return path;
	return path(context);
}

export function resolveLiveLinksConfig(config: LiveLinksPluginConfig): ResolvedLiveLinksPluginConfig {
	const documentTypeNames = Object.keys(config.documents);

	return {
		...config,
		baseUrl: resolveLiveSiteBaseUrl(config.baseUrl),
		documentTypeNames,
		resolvePath(context) {
			const doc = config.documents[context.documentType];
			if (!doc) return null;
			return resolveDocumentPath(doc.path, context);
		},
		requiresSlug(documentType) {
			return config.documents[documentType]?.requiresSlug ?? false;
		},
		slugPathFor(documentType) {
			return config.documents[documentType]?.slugPath ?? config.slugPath ?? DEFAULT_SLUG_PATH;
		},
		titlePathFor(documentType) {
			return config.documents[documentType]?.titlePath ?? config.titlePath ?? DEFAULT_TITLE_PATH;
		},
		resolveTitleFor(context) {
			const doc = config.documents[context.documentType];
			const resolve =
				doc?.resolveTitle ?? config.resolveTitle;
			if (resolve) {
				const resolved = resolve(context);
				if (resolved.trim()) return resolved.trim();
			}
			if (doc?.title?.trim()) return doc.title.trim();
			return context.documentType;
		}
	};
}
