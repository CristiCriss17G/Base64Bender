<script lang="ts">
	import { clipboard } from '@skeletonlabs/skeleton';
	import LockClosedIcon from './icons/LockClosedIcon.svelte';
	import LockOpenIcon from './icons/LockOpenIcon.svelte';
	import ClipboardDocumentListIcon from './icons/ClipboardDocumentListIcon.svelte';

	export let textareaId: string;
	export let lockFunction: () => boolean;
	let lockState = false;
</script>

<div class="input-group input-group-divider grid-cols-[auto_auto] mt-2">
	<button
		class="btn-control variant-filled-primary sep-border"
		title="Copy to clipboard"
		use:clipboard={{ input: textareaId }}
	>
		<ClipboardDocumentListIcon />
	</button>
	<button
		class="btn-control variant-filled-primary"
		title="Lock the textarea"
		on:click={() => {
			lockState = lockFunction();
		}}
	>
		{#if lockState}
			<LockClosedIcon />
		{:else}
			<LockOpenIcon />
		{/if}
	</button>
</div>

<style lang="postcss">
	.btn-control {
		@apply !justify-center p-2;

		&.sep-border {
			@apply border-solid border-e border-e-primary-100;
		}
	}
</style>
