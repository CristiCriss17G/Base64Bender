<script lang="ts">
	import type { Writable } from 'svelte/store';

	import { getToastStore } from '@skeletonlabs/skeleton';
	import { initRightClickClipboardAction } from '$lib/helpers/clipboardHelpers';
	import { userSettings } from '$lib/stores/userSettings';
	import { onMount } from 'svelte';

	import DefaultBase64Controls from './DefaultBase64Controls.svelte';
	import DocumentArrowUp from './icons/DocumentArrowUp.svelte';

	interface Props {
		value: Writable<string>;
		base64EncoderFunction: (value: string) => void;
	}

	let { value, base64EncoderFunction }: Props = $props();

	const toastStore = getToastStore();

	const textareaId: string = 'base64decoded';

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
		{#snippet textareaControls({
			handleDrop,
			handleDragOver,
			handleDragLeave,
			isDragging,
			fileDropClassesActive
		})}
			<div class="relative">
				<textarea
					class={`textarea main-textarea ${fileDropClassesActive}`}
					id={textareaId}
					bind:value={$value}
					oninput={() => base64EncoderFunction($value)}
					placeholder="Place normal string or drop a file..."
					data-clipboard={textareaId}
					readonly={lockTextarea}
					ondrop={handleDrop}
					ondragover={handleDragOver}
					ondragleave={handleDragLeave}
				></textarea>
				{#if isDragging}
					<div
						class="absolute pointer-events-none inset-0 flex flex-col items-center justify-center"
					>
						<figure class="animate-bounce"><DocumentArrowUp sizeClasses="w-24 h-24" /></figure>
						<p class="text-white text-xl font-bold">Drop your file here</p>
					</div>
				{/if}
			</div>
		{/snippet}
		{#snippet additionalControls()}
			<label class="flex items-center space-x-2 mt-2">
				<input class="checkbox" type="checkbox" bind:checked={$userSettings.isUrlSafe} />
				<p>URL Safe</p>
			</label>
		{/snippet}
	</DefaultBase64Controls>
</div>
