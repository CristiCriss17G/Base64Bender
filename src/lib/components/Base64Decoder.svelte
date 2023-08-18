<script lang="ts">
	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { userSettings } from '$lib/stores/userSettings';
	import DefaultBase64Controls from './DefaultBase64Controls.svelte';
	import { initRightClickClipboardAction } from '$lib/helpers/clipboardHelpers';

	export let value: Writable<string>;
	export let base64DecoderFunction: (value: string) => void;

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
		value.set(newValue);
		base64DecoderFunction(newValue);
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
	<textarea
		class="textarea main-textarea"
		id={textareaId}
		bind:value={$value}
		on:input={() => base64DecoderFunction($value)}
		placeholder="Place normal string string."
		data-clipboard={textareaId}
		readonly={lockTextarea}
	/>
	<DefaultBase64Controls zoneType="decoded" {lockFunction} {textareaId} />
	<label class="flex items-center space-x-2 mt-2">
		<input class="checkbox" type="checkbox" bind:checked={$userSettings.isUrlSafe} />
		<p>URL Safe</p>
	</label>
</div>
