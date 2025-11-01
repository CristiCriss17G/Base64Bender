<script lang="ts">
	import type { Writable } from 'svelte/store';

	import { initRightClickClipboardAction } from '$lib/helpers/clipboardHelpers';
	import { userSettings } from '$lib/stores/userSettings';
	import { FileUp } from '@lucide/svelte';
	import { onMount } from 'svelte';

	import DefaultBase64Controls from './DefaultBase64Controls.svelte';

	interface Props {
		base64EncoderFunction: (value: string) => void;
		value: Writable<string>;
	}

	let { base64EncoderFunction, value }: Props = $props();

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
			initRightClickClipboardAction(textarea, valueChanger, additionalCheck);
		});
		return initRightClickClipboardAction(textarea, valueChanger, additionalCheck);
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
			fileDropClassesActive,
			handleDragLeave,
			handleDragOver,
			handleDrop,
			isDragging
		})}
			<div class="relative">
				<textarea
					class={['main-textarea', 'textarea', fileDropClassesActive]}
					id={textareaId}
					bind:value={$value}
					oninput={() => base64EncoderFunction($value)}
					placeholder="Place normal string or drop a file..."
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
			<label class="mt-2 flex items-center space-x-2">
				<input class="checkbox" type="checkbox" bind:checked={$userSettings.isUrlSafe} />
				<p>URL Safe</p>
			</label>
		{/snippet}
	</DefaultBase64Controls>
</div>
