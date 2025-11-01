import { userSettings } from '$lib/stores/userSettings';
import { get } from 'svelte/store';

let _prefersDark: MediaQueryList | undefined;

export function initThemeChanger(prefersDarkParam: MediaQueryList) {
	_prefersDark = prefersDarkParam;
	applyTheme(); // initial check
	_prefersDark.addEventListener('change', applyTheme);
	userSettings.subscribe(applyTheme);
}

function applyTheme() {
	const theme = get(userSettings).theme;
	if (theme === null) {
		document.documentElement.dataset.mode = _prefersDark?.matches ? 'dark' : 'light';
	} else {
		document.documentElement.dataset.mode = theme;
	}
}
