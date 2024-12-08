import type { Config } from 'tailwindcss';

import { skeleton } from '@skeletonlabs/tw-plugin';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import { join } from 'path';

const config = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		// 3. Append the path to the Skeleton package
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	// 2. Opt for dark mode to be handled via the class method
	darkMode: 'class',
	plugins: [
		forms,
		typography,
		// 4. Append the Skeleton plugin (after other plugins)
		skeleton({
			themes: {
				// Register each theme within this array:
				preset: [
					{ enhancements: true, name: 'crimson' },
					{ enhancements: true, name: 'hamlindigo' },
					{ enhancements: true, name: 'modern' },
					{ enhancements: true, name: 'vintage' },
					{ enhancements: true, name: 'wintry' }
				]
			}
		})
	],
	theme: {
		extend: {}
	}
} satisfies Config;

export default config;
