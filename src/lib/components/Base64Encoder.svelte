<script lang="ts">
	import type { Writable } from 'svelte/store';
	import DefaultBase64Controls from './DefaultBase64Controls.svelte';
	import { onMount } from 'svelte';
	import { userSettings } from '$lib/stores/userSettings';
	import { initRightClickClipboardAction } from '$lib/helpers/clipboardHelpers';

	export let value: Writable<string>;
	export let base64EncoderFunction: (value: string) => void;

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
		value.set(newValue);
		base64EncoderFunction(newValue);
	};

	onMount(() => {
		const textarea = document.getElementById(textareaId) as HTMLTextAreaElement;
		userSettings.subscribe(() => {
			initRightClickClipboardAction(textarea, valueChanger, additionalCheck);
		});
		window.addEventListener('dragover', (e: DragEvent) => e.preventDefault());
		window.addEventListener('drop', (e: DragEvent) => e.preventDefault());
		const rightClickEventRemove = initRightClickClipboardAction(
			textarea,
			valueChanger,
			additionalCheck
		);
		return () => {
			window.removeEventListener('dragover', (e: DragEvent) => e.preventDefault());
			window.removeEventListener('drop', (e: DragEvent) => e.preventDefault());
			rightClickEventRemove ? rightClickEventRemove() : null;
		};
	});
</script>

<div class="w-full">
	<DefaultBase64Controls zoneType="encoded" {lockFunction} {textareaId} {valueChanger}>
		<svelte:fragment
			slot="textareaControls"
			let:handleDrop
			let:handleDragOver
			let:handleDragLeave
			let:isDragging
		>
			<div class="relative">
				<textarea
					class="textarea main-textarea as-code break-all focus:outline-none focus:border-blue-500"
					id={textareaId}
					bind:value={$value}
					on:input={() => base64EncoderFunction($value)}
					placeholder="Place base64 encoded string."
					spellcheck="false"
					data-clipboard={textareaId}
					readonly={lockTextarea}
					on:drop={handleDrop}
					on:dragover={handleDragOver}
					on:dragleave={handleDragLeave}
				/>
				{#if isDragging}
					<div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
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
