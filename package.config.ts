import { defineConfig } from '@sanity/pkg-utils';

export default defineConfig({
	tsdoc: {
		rules: {
			'ae-missing-release-tag': 'off'
		}
	},
	deps: {
		neverBundle: [
			'react',
			'react-dom',
			'react/jsx-runtime',
			'sanity',
			/^@sanity\//
		]
	}
});
