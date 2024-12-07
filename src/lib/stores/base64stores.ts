import type { ToastSettings, ToastStore } from '@skeletonlabs/skeleton';
import type { Base64Utilities } from '$lib/types/base64Utilities';
import type { UserSettings } from '$lib/types/userSettings';

import { writable, get } from 'svelte/store';

import { userSettings, checkOrUpdateUserSettings } from './userSettings';

// These stores will hold the values of the textareas.
export const originalText = writable('');
export const base64Text = writable('');

const hasInitializedUserSettingsUpdate = false;

let initializedToBase64: (str: string) => void;
let initializedFromBase64: (encoded: string) => void;

export const initializeUserSettingsUpdate = (toastStore: ToastStore): Base64Utilities => {
	if (hasInitializedUserSettingsUpdate)
		return { fromBase64: initializedFromBase64, toBase64: initializedToBase64 };

	userSettings.subscribe(() => {
		toBase64(get(originalText));
	});

	function toBase64(str: string) {
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
				// Provide any utility or variant background style:
				background: 'variant-filled-error',
				message: `Failed to encode to base64: ${e}`,
				timeout: 5000
			};
			toastStore.trigger(t);
		}
	}

	function fromBase64(encoded: string) {
		try {
			// Detect URL-safe characters
			let newUserSettings: UserSettings | undefined;
			if (/[-_]/.test(encoded)) {
				newUserSettings = { ...get(userSettings), isUrlSafe: true };
				encoded = encoded.replace(/-/g, '+').replace(/_/g, '/');
			} else if (/[+/]/.test(encoded) && get(userSettings).isUrlSafe) {
				newUserSettings = { ...get(userSettings), isUrlSafe: false };
			}
			const decoded = decodeURIComponent(
				Array.prototype.map
					.call(atob(encoded), (char) => '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2))
					.join('')
			);
			originalText.set(decoded);
			if (newUserSettings) {
				checkOrUpdateUserSettings(newUserSettings);
			}
		} catch (e) {
			const t: ToastSettings = {
				// Provide any utility or variant background style:
				background: 'variant-filled-error',
				message: `Failed to decode from base64: ${e}`,
				timeout: 5000
			};
			toastStore.trigger(t);
		}
	}

	initializedToBase64 = toBase64;
	initializedFromBase64 = fromBase64;

	return { fromBase64, toBase64 };
};
