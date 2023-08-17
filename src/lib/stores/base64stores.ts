import { writable, get } from 'svelte/store';
import { userSettings } from './userSettings';

// These stores will hold the values of the textareas.
export const originalText = writable('');
export const base64Text = writable('');

export function toBase64(str: string) {
	try {
		let encoded = btoa(
			encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) =>
				String.fromCharCode(parseInt(p1, 16))
			)
		);
		if (get(userSettings).isUrlSafe) {
			// Using the value from the subscription
			encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_');
		}
		if (get(userSettings).splitMarker > 0) {
			encoded = encoded.replace(new RegExp(`(.{${get(userSettings).splitMarker}})`, 'g'), '$1\n');
		}
		base64Text.set(encoded);
	} catch (e) {
		console.error('Failed to encode to base64:', e);
	}
}

export function fromBase64(encoded: string) {
	try {
		// Detect URL-safe characters
		if (/-|_/.test(encoded)) {
			userSettings.update((settings) => ({ ...settings, isUrlSafe: true }));
			encoded = encoded.replace(/-/g, '+').replace(/_/g, '/');
		} else {
			userSettings.update((settings) => ({ ...settings, isUrlSafe: false }));
		}
		const decoded = decodeURIComponent(
			Array.prototype.map
				.call(atob(encoded), (char) => '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2))
				.join('')
		);
		originalText.set(decoded);
	} catch (e) {
		console.error('Failed to decode from base64:', e);
	}
}
