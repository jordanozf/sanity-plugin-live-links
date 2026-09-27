import { createContext, useContext, type ReactNode } from 'react';
import type { ResolvedLiveLinksPluginConfig } from './types';

const LiveLinksConfigContext = createContext<ResolvedLiveLinksPluginConfig | null>(null);

export function LiveLinksConfigProvider({
	config,
	children
}: {
	config: ResolvedLiveLinksPluginConfig;
	children: ReactNode;
}) {
	return (
		<LiveLinksConfigContext.Provider value={config}>{children}</LiveLinksConfigContext.Provider>
	);
}

export function useLiveLinksConfig() {
	const config = useContext(LiveLinksConfigContext);
	if (!config) {
		throw new Error('sanity-plugin-live-links: missing LiveLinksConfigProvider');
	}
	return config;
}
