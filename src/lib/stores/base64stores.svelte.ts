import type { Base64Utilities } from '$lib/types/base64Utilities';
import type { UserSettings } from '$lib/types/userSettings';

import { get, writable } from 'svelte/store';

import { toaster } from './toastStore';
import { checkOrUpdateUserSettings, userSettings } from './userSettings';

export const originalText = writable('');
export const base64Text = writable('');

let hasInitializedUserSettingsUpdate = false;

let initializedToBase64: (str: string) => void;
let initializedFromBase64: (encoded: string) => void;

export function initializeUserSettingsUpdate(): Base64Utilities {
	if (hasInitializedUserSettingsUpdate)
		return { fromBase64: initializedFromBase64, toBase64: initializedToBase64 };

	userSettings.subscribe(() => {
		toBase64(get(originalText));
	});

	function toBase64(str: string) {
		try {
			let encoded = btoa(
				encodeURIComponent(str).replaceAll(/%([0-9A-F]{2})/g, (match, p1) =>
					String.fromCodePoint(Number.parseInt(p1, 16))
				)
			);
			if (get(userSettings).isUrlSafe) {
				// Using the value from the subscription
				encoded = encoded.replaceAll('+', '-').replaceAll('/', '_');
			}
			if (get(userSettings).splitMarker > 0) {
				encoded = encoded.replaceAll(
					new RegExp(`(.{${get(userSettings).splitMarker}})`, 'g'),
					'$1\n'
				);
			}
			base64Text.set(encoded);
		} catch (e) {
			toaster.error({
				description: `Failed to encode to base64: ${e}`,
				duration: 5000,
				title: 'Encoding Error'
			});
		}
	}

	function fromBase64(encoded: string) {
		try {
			// Detect URL-safe characters
			let newUserSettings: undefined | UserSettings;
			if (/[-_]/.test(encoded)) {
				newUserSettings = { ...get(userSettings), isUrlSafe: true };
				encoded = encoded.replaceAll('-', '+').replaceAll('_', '/');
			} else if (/[+/]/.test(encoded) && get(userSettings).isUrlSafe) {
				newUserSettings = { ...get(userSettings), isUrlSafe: false };
			}
			const decoded = decodeURIComponent(
				Array.prototype.map
					.call(atob(encoded), (char) => '%' + ('00' + char.codePointAt(0).toString(16)).slice(-2))
					.join('')
			);
			originalText.set(decoded);
			if (newUserSettings) {
				checkOrUpdateUserSettings(newUserSettings);
			}
		} catch (e) {
			toaster.error({
				description: `Failed to decode from base64: ${e}`,
				duration: 5000,
				title: 'Decoding Error'
			});
		}
	}

	initializedToBase64 = toBase64;
	initializedFromBase64 = fromBase64;
	hasInitializedUserSettingsUpdate = true;

	return { fromBase64, toBase64 };
}
