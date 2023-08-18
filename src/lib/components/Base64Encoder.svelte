<script lang="ts">
	import { get, type Writable } from 'svelte/store';
	import DefaultBase64Controls from './DefaultBase64Controls.svelte';
	import { onMount } from 'svelte';
	import { userSettings } from '$lib/stores/userSettings';

	export let value: Writable<string>;
	export let base64EncoderFunction: (value: string) => void;

	const textareaId: string = 'base64encoded';

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
					base64EncoderFunction($value);
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
		class="textarea main-textarea as-code break-all"
		id={textareaId}
		bind:value={$value}
		on:input={() => base64EncoderFunction($value)}
		placeholder="Place base64 encoded string."
		spellcheck="false"
		data-clipboard={textareaId}
		readonly={lockTextarea}
	/>
	<DefaultBase64Controls {lockFunction} {textareaId} />
	<div class="input-group input-group-divider grid-cols-[auto_1fr_auto_auto] mt-2">
		<div class="input-group-shim">W</div>
		<input type="number" placeholder="Split by..." bind:value={$userSettings.splitMarker} />
		<button
			class="variant-filled-secondary border-solid border-e border-e-secondary-100"
			on:click={() => ($userSettings.splitMarker = 0)}>W0</button
		>
		<button
			class="button variant-filled-secondary"
			on:click={() => ($userSettings.splitMarker = 76)}>W76</button
		>
	</div>
</div>
