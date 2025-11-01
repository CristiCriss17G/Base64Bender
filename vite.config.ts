import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import devtoolsJson from 'vite-plugin-devtools-json';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		devtoolsJson(),
		SvelteKitPWA({
			devOptions: {
				enabled: true,
				navigateFallback: '/',
				suppressWarnings: process.env.SUPPRESS_WARNING === 'true',
				type: 'module'
			},
			injectManifest: {
				globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}']
			},
			manifest: {
				background_color: '#242c46',
				display: 'standalone',
				icons: [
					{
						sizes: '192x192',
						src: './android-chrome-192x192.png',
						type: 'image/png'
					},
					{
						sizes: '512x512',
						src: './android-chrome-512x512.png',
						type: 'image/png'
					},
					{
						purpose: 'any maskable',
						sizes: '512x512',
						src: './android-chrome-512x512.png',
						type: 'image/png'
					}
				],
				name: 'Base64Bender',
				scope: '/',
				short_name: 'Base64Bender',
				start_url: '/',
				theme_color: '#06b6d4'
			},
			mode: (process.env.NODE_ENV as 'development' | 'production' | undefined) ?? 'development',
			selfDestroying: process.env.SELF_DESTROYING_SW === 'true',
			strategies: 'generateSW',
			workbox: {
				globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}']
			}
		})
	],
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					browser: {
						enabled: true,
						instances: [{ browser: 'chromium' }],
						provider: 'playwright'
					},
					environment: 'browser',
					exclude: ['src/lib/server/**'],
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					name: 'client',
					setupFiles: ['./vitest-setup-client.ts']
				}
			},
			{
				extends: './vite.config.ts',
				test: {
					environment: 'node',
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					include: ['src/**/*.{test,spec}.{js,ts}'],
					name: 'server'
				}
			}
		]
	}
});
