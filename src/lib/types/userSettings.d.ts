export type ColorTheme = UserSettings['colorTheme'];

export type UserSettings = {
	colorTheme:
		| 'cerberus'
		| 'crimson'
		| 'hamlindigo'
		| 'mint'
		| 'modern'
		| 'nosh'
		| 'nouveau'
		| 'seafoam'
		| 'terminus'
		| 'vintage'
		| 'wintry';
	isUrlSafe: boolean;
	rightClickPaste: boolean;
	splitMarker: number;
	theme: 'dark' | 'light' | null;
};
