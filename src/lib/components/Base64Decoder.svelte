<script lang="ts">
	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { userSettings } from '$lib/stores/userSettings';
	import { initRightClickClipboardAction } from '$lib/helpers/clipboardHelpers';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import DefaultBase64Controls from './DefaultBase64Controls.svelte';
	import DocumentArrowUp from './icons/DocumentArrowUp.svelte';

	export let value: Writable<string>;
	export let base64DecoderFunction: (value: string) => void;

	const toastStore = getToastStore();

	const textareaId: string = 'base64encoded';

	let lockTextarea = false;
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
			initRightClickClipboardAction(toastStore, textarea, valueChanger, additionalCheck);
		});
		const rightClickEventRemove = initRightClickClipboardAction(
			toastStore,
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
		<svelte:fragment
			slot="textareaControls"
			let:handleDrop
			let:handleDragOver
			let:handleDragLeave
			let:isDragging
			let:fileDropClassesActive
		>
			<div class="relative">
				<textarea
					class={`textarea main-textarea as-code break-all ${fileDropClassesActive}`}
					id={textareaId}
					bind:value={$value}
					on:input={() => base64DecoderFunction($value)}
					placeholder="Place base64 encoded string or drop a file..."
					spellcheck="false"
					data-clipboard={textareaId}
					readonly={lockTextarea}
					on:drop={handleDrop}
					on:dragover={handleDragOver}
					on:dragleave={handleDragLeave}
				/>
				{#if isDragging}
					<div
						class="absolute pointer-events-none inset-0 flex flex-col items-center justify-center"
					>
						<figure class="animate-bounce"><DocumentArrowUp sizeClasses="w-24 h-24" /></figure>
						<p class="text-white text-xl font-bold">Drop your file here</p>
					</div>
				{/if}
			</div>
		</svelte:fragment>
		<svelte:fragment slot="additionalControls">
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
		</svelte:fragment>
	</DefaultBase64Controls>
</div>
