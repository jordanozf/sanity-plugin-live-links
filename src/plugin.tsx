import { definePlugin, type ObjectInputProps, type InputProps } from 'sanity';
import { LiveLinksConfigProvider } from './context';
import { resolveLiveLinksConfig } from './config';
import { DocumentLiveLinksInput } from './DocumentLiveLinksInput';
import type { LiveLinksPluginConfig } from './types';

function isLiveLinksRootInput(props: InputProps, documentTypes: Set<string>) {
	return (
		props.id === 'root' &&
		props.schemaType.type?.name === 'document' &&
		documentTypes.has(props.schemaType.name)
	);
}

/** Root document form input wrapper (use on `defineConfig({ form: … })` or via `liveLinksPlugin`). */
export function createLiveLinksInputComponent(config: LiveLinksPluginConfig) {
	const resolvedConfig = resolveLiveLinksConfig(config);
	const documentTypes = new Set(resolvedConfig.documentTypeNames);

	return function LiveLinksRootInput(props: InputProps) {
		if (isLiveLinksRootInput(props, documentTypes)) {
			return (
				<LiveLinksConfigProvider config={resolvedConfig}>
					<DocumentLiveLinksInput
						{...(props as ObjectInputProps)}
						documentType={props.schemaType.name}
					/>
				</LiveLinksConfigProvider>
			);
		}

		return props.renderDefault(props);
	};
}

/** Workspace-level form config (reliable in embedded Studio hosts). */
export function liveLinksFormConfig(config: LiveLinksPluginConfig) {
	return {
		form: {
			components: {
				input: createLiveLinksInputComponent(config)
			}
		}
	};
}

export function liveLinksPlugin(config: LiveLinksPluginConfig) {
	return definePlugin({
		name: 'sanity-plugin-live-links',
		...liveLinksFormConfig(config)
	});
}
