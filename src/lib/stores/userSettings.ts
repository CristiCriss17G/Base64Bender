import { localStorageStore } from '@skeletonlabs/skeleton';
import type { UserSettings } from '$lib/types/userSettings';
import type { Writable } from 'svelte/store';

const defaultSettings: UserSettings = {
	theme: 'light',
	isUrlSafe: false,
	splitMarker: 0
};

export const userSettings: Writable<UserSettings> = localStorageStore<UserSettings>(
	'userSettings',
	defaultSettings
);
