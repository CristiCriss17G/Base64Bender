<script lang="ts">
	import type { Writable } from 'svelte/store';

	import { initRightClickClipboardAction } from '$lib/helpers/clipboardHelpers';
	import { userSettings } from '$lib/stores/userSettings';
	import { FileUp } from '@lucide/svelte';
	import { onMount } from 'svelte';

	import DefaultBase64Controls from './DefaultBase64Controls.svelte';

	interface Props {
		base64DecoderFunction: (value: string) => void;
		value: Writable<string>;
	}

	let { base64DecoderFunction, value }: Props = $props();

	const textareaId: string = 'base64encoded';

	let lockTextarea = $state(false);
	const lockFunction = () => {
		return (lockTextarea = !lockTextarea);
	};

	// Right click paste
	const additionalCheck = () => {
		return lockTextarea;
	};

	const valueChanger = (newValue: string) => {
		// Replace CRLF with LF
		newValue = newValue.replace(/\r\n/g, '\n');

		// Trim empty lines from the beginning and end
		newValue = newValue.replace(/^\n+|\n+$/g, '');

		value.set(newValue);
		base64DecoderFunction(newValue);
	};

	onMount(() => {
		const textarea = document.getElementById(textareaId) as HTMLTextAreaElement;
		userSettings.subscribe(() => {
			initRightClickClipboardAction(textarea, valueChanger, additionalCheck);
		});
		const rightClickEventRemove = initRightClickClipboardAction(
			textarea,
			valueChanger,
			additionalCheck
		);
		return () => {
			if (rightClickEventRemove) {
				rightClickEventRemove();
			}
		};
	});
</script>

<div class="w-full">
	<DefaultBase64Controls
		zoneType="encoded"
		textValue={$value}
		{lockFunction}
		{textareaId}
		{valueChanger}
	>
		{#snippet textareaControls({
			fileDropClassesActive,
			handleDragLeave,
			handleDragOver,
			handleDrop,
			isDragging
		})}
			<div class="relative">
				<textarea
					class={['main-textarea', 'as-code', 'textarea', 'break-all', fileDropClassesActive]}
					id={textareaId}
					bind:value={$value}
					oninput={() => base64DecoderFunction($value)}
					placeholder="Place base64 encoded string or drop a file..."
					spellcheck="false"
					data-clipboard={textareaId}
					readonly={lockTextarea}
					disabled={lockTextarea}
					ondrop={handleDrop}
					ondragover={handleDragOver}
					ondragleave={handleDragLeave}
				></textarea>
				{#if isDragging}
					<div
						class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
					>
						<figure class="animate-bounce"><FileUp class="h-24 w-24" /></figure>
						<p class="text-xl font-bold text-white">Drop your file here</p>
					</div>
				{/if}
			</div>
		{/snippet}
		{#snippet additionalControls()}
			<div class="mt-2 input-group grid-cols-4 md:grid-cols-[auto_1fr_auto_auto]">
				<div class="ig-cell">W</div>
				<input
					class="ig-input"
					type="number"
					placeholder="Split by..."
					bind:value={$userSettings.splitMarker}
				/>
				<button
					class="ig-btn border-e border-solid border-e-secondary-100 preset-filled-secondary-500"
					onclick={() => ($userSettings.splitMarker = 0)}>W0</button
				>
				<button
					class="ig-btn preset-filled-secondary-500"
					onclick={() => ($userSettings.splitMarker = 76)}>W76</button
				>
			</div>
		{/snippet}
	</DefaultBase64Controls>
</div>
