<script lang="ts">
	import type { Writable } from 'svelte/store';
	import type { UserSettings } from '$lib/types/userSettings';

	export let value: Writable<string>;
	export let base64EncoderFunction: (value: string) => void;
	export let userSettings: Writable<UserSettings>;
</script>

<div class="w-full">
	<textarea
		class="textarea main-textarea as-code"
		bind:value={$value}
		on:input={() => base64EncoderFunction($value)}
		placeholder="Place base64 encoded string."
	/>
	<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] mt-2">
		<div class="input-group-shim">W</div>
		<input type="number" placeholder="Split by..." bind:value={$userSettings.splitMarker} />
		<button class="variant-filled-secondary">Submit</button>
	</div>
</div>
