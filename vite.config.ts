import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
		sveltekit(),
		purgeCss(),
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
			workbox: {
				globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}']
			}
		})
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
