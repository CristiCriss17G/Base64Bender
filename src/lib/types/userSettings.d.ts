export type UserSettings = {
	theme: 'light' | 'dark';
	isUrlSafe: boolean;
	splitMarker: number;
	rightClickPaste: boolean;
	colorTheme: 'crimson' | 'hamlindigo' | 'modern' | 'vintage' | 'wintry';
};

export type ColorTheme = UserSettings['colorTheme'];
