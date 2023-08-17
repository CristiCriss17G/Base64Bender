<script lang="ts">
	import type { UserSettings } from '$lib/types/userSettings';
	import type { Writable } from 'svelte/store';

	export let value: Writable<string>;
	export let base64DecoderFunction: (value: string) => void;
	export let userSettings: Writable<UserSettings>;

	// userSettings.subscribe(() => base64DecoderFunction($value));
</script>

<div class="w-full">
	<textarea
		class="textarea main-textarea"
		bind:value={$value}
		on:input={() => base64DecoderFunction($value)}
		placeholder="Place normal string string."
	/>
	<label class="flex items-center space-x-2 mt-2">
		<input class="checkbox" type="checkbox" bind:checked={$userSettings.isUrlSafe} />
		<p>URL Safe</p>
	</label>
</div>
