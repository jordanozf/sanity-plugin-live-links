import { createContext, useContext, type ReactNode } from 'react';
import type { LiveLinksPluginConfig } from './types';

const LiveLinksConfigContext = createContext<LiveLinksPluginConfig | null>(null);

export function LiveLinksConfigProvider({
	config,
	children
}: {
	config: LiveLinksPluginConfig;
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
