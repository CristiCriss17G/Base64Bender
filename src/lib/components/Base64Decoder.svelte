<script lang="ts">
	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { get } from 'svelte/store';
	import { userSettings } from '$lib/stores/userSettings';
	import DefaultBase64Controls from './DefaultBase64Controls.svelte';

	export let value: Writable<string>;
	export let base64DecoderFunction: (value: string) => void;

	const textareaId: string = 'base64decoded';

	let lockTextarea = false;
	const lockFunction = () => {
		return (lockTextarea = !lockTextarea);
	};

	// Right click paste
	let rightClickCount: number = 0;

	async function getClipboardContent(): Promise<string> {
		try {
			const permissionStatus: PermissionStatus = await navigator.permissions.query({
				name: 'clipboard-read'
			});
			if (permissionStatus.state == 'granted' || permissionStatus.state == 'prompt') {
				return await navigator.clipboard.readText();
			}
		} catch (err) {
			console.error('Could not read from clipboard:', err);
		}
		return '';
	}

	onMount(() => {
		if (!get(userSettings).rightClickPaste) return;
		const textarea: HTMLTextAreaElement | null = document.getElementById(
			textareaId
		) as HTMLTextAreaElement;

		const handleContextMenu = async (e: Event) => {
			if (!get(userSettings).rightClickPaste || lockTextarea) return;

			rightClickCount++;

			if (rightClickCount === 1) {
				e.preventDefault();
				const clipboardContent: string = await getClipboardContent();
				if (clipboardContent) {
					$value = clipboardContent;
					base64DecoderFunction($value);
				}
			} else {
				rightClickCount = 0;
			}
		};

		const handleBlur = (): void => {
			rightClickCount = 0;
		};

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
	});
</script>

<div class="w-full">
	<textarea
		class="textarea main-textarea"
		id={textareaId}
		bind:value={$value}
		on:input={() => base64DecoderFunction($value)}
		placeholder="Place normal string string."
		data-clipboard={textareaId}
		readonly={lockTextarea}
	/>
	<DefaultBase64Controls {lockFunction} {textareaId} />
	<label class="flex items-center space-x-2 mt-2">
		<input class="checkbox" type="checkbox" bind:checked={$userSettings.isUrlSafe} />
		<p>URL Safe</p>
	</label>
</div>
