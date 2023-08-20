import { writable, get } from 'svelte/store';
import { userSettings, checkOrUpdateUserSettings } from './userSettings';
import { toastStore, type ToastSettings } from '@skeletonlabs/skeleton';

// These stores will hold the values of the textareas.
export const originalText = writable('');
export const base64Text = writable('');

userSettings.subscribe(() => {
	toBase64(get(originalText));
});

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
		const t: ToastSettings = {
			message: `Failed to encode to base64: ${e}`,
			// Provide any utility or variant background style:
			background: 'variant-filled-error',
			timeout: 5000
		};
		toastStore.trigger(t);
	}
}

export function fromBase64(encoded: string) {
	try {
		// Detect URL-safe characters
		if (/-|_/.test(encoded)) {
			const newUserSettings = { ...get(userSettings), isUrlSafe: true };
			checkOrUpdateUserSettings(newUserSettings);
			encoded = encoded.replace(/-/g, '+').replace(/_/g, '/');
		} else {
			const newUserSettings = { ...get(userSettings), isUrlSafe: false };
			checkOrUpdateUserSettings(newUserSettings);
		}
		const decoded = decodeURIComponent(
			Array.prototype.map
				.call(atob(encoded), (char) => '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2))
				.join('')
		);
		originalText.set(decoded);
	} catch (e) {
		const t: ToastSettings = {
			message: `Failed to decode from base64: ${e}`,
			// Provide any utility or variant background style:
			background: 'variant-filled-error',
			timeout: 5000
		};
		toastStore.trigger(t);
	}
}
