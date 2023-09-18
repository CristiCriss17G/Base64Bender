<script lang="ts">
	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { userSettings } from '$lib/stores/userSettings';
	import { initRightClickClipboardAction } from '$lib/helpers/clipboardHelpers';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import DefaultBase64Controls from './DefaultBase64Controls.svelte';
	import DocumentArrowUp from './icons/DocumentArrowUp.svelte';

	export let value: Writable<string>;
	export let base64EncoderFunction: (value: string) => void;

	const toastStore = getToastStore();

	const textareaId: string = 'base64decoded';

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

		value.set(newValue);
		base64EncoderFunction(newValue);
	};

	onMount(() => {
		const textarea = document.getElementById(textareaId) as HTMLTextAreaElement;
		userSettings.subscribe(() => {
			initRightClickClipboardAction(toastStore, textarea, valueChanger, additionalCheck);
		});
		return initRightClickClipboardAction(toastStore, textarea, valueChanger, additionalCheck);
	});
</script>

<div class="w-full">
	<DefaultBase64Controls
		zoneType="decoded"
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
					class={`textarea main-textarea ${fileDropClassesActive}`}
					id={textareaId}
					bind:value={$value}
					on:input={() => base64EncoderFunction($value)}
					placeholder="Place normal string or drop a file..."
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
			<label class="flex items-center space-x-2 mt-2">
				<input class="checkbox" type="checkbox" bind:checked={$userSettings.isUrlSafe} />
				<p>URL Safe</p>
			</label>
		</svelte:fragment>
	</DefaultBase64Controls>
</div>
