import { toaster } from '$lib/stores/toastStore';
import { userSettings } from '$lib/stores/userSettings';
import { get } from 'svelte/store';

export async function getClipboardContent(): Promise<string> {
	try {
		const permissionStatus: PermissionStatus = await navigator.permissions.query({
			name: 'clipboard-read'
		});
		if (permissionStatus.state == 'granted' || permissionStatus.state == 'prompt') {
			return await navigator.clipboard.readText();
		}
	} catch (err) {
		console.error('Could not read from clipboard:', err);
		toaster.error({
			description: `Could not read from clipboard: ${err}`,
			duration: 5000,
			title: 'Clipboard Error'
		});
	}
	return '';
}

export function initRightClickClipboardAction(
	textarea: HTMLTextAreaElement | null,
	valueChanger: (value: string) => void,
	additionalCheck: () => boolean = () => false
) {
	if (!get(userSettings).rightClickPaste) return;

	let rightClickCount: number = 0;

	const handleContextMenu = async (e: Event) => {
		if (!get(userSettings).rightClickPaste || additionalCheck()) return;

		rightClickCount++;

		if (rightClickCount === 1) {
			e.preventDefault();
			const clipboardContent: string = await getClipboardContent();
			if (clipboardContent) {
				valueChanger(clipboardContent);
			}
		} else {
			rightClickCount = 0;
		}
	};

	const handleBlur = (): void => {
		rightClickCount = 0;
	};

	if (textarea) {
		textarea.removeEventListener('contextmenu', handleContextMenu);
		textarea.removeEventListener('blur', handleBlur);
	}

	if (textarea) {
		textarea.addEventListener('contextmenu', handleContextMenu);
		textarea.addEventListener('blur', handleBlur);
	}

	return () => {
		if (textarea) {
			textarea.removeEventListener('contextmenu', handleContextMenu);
			textarea.removeEventListener('blur', handleBlur);
		}
	};
}
