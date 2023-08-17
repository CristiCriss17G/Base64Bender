<script lang="ts">
	import type { Writable } from 'svelte/store';

	export let value: Writable<string>;
	export let base64DecoderFunction: (value: string) => void;
</script>

<div class="w-full">
	<textarea
		class="textarea main-textarea"
		bind:value={$value}
		on:input={() => base64DecoderFunction($value)}
		placeholder="Place normal string string."
	/>
</div>
