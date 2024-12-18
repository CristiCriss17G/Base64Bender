import type { UserSettings } from '$lib/types/userSettings';
import type { Writable } from 'svelte/store';

import { persisted } from 'svelte-persisted-store';
import { get } from 'svelte/store';

const defaultSettings: UserSettings = {
	isUrlSafe: false,
	rightClickPaste: false,
	splitMarker: 0,
	theme: 'light',
	colorTheme: 'modern'
};

export function checkOrUpdateUserSettings(userSettingsParam: UserSettings) {
	const settings = get(userSettings);
	if (settings.theme !== userSettingsParam.theme) {
		userSettings.update((settings) => ({ ...settings, theme: userSettingsParam.theme }));
	}
	if (settings.isUrlSafe !== userSettingsParam.isUrlSafe) {
		userSettings.update((settings) => ({ ...settings, isUrlSafe: userSettingsParam.isUrlSafe }));
	}
	if (settings.splitMarker !== userSettingsParam.splitMarker) {
		userSettings.update((settings) => ({
			...settings,
			splitMarker: userSettingsParam.splitMarker
		}));
	}
	if (settings.rightClickPaste !== userSettingsParam.rightClickPaste) {
		userSettings.update((settings) => ({
			...settings,
			rightClickPaste: userSettingsParam.rightClickPaste
		}));
	}
}

export const userSettings: Writable<UserSettings> = persisted<UserSettings>(
	'userSettingsB64b',
	defaultSettings
);
