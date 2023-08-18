<script lang="ts">
	import { clipboard } from '@skeletonlabs/skeleton';
	import LockClosedIcon from './icons/LockClosedIcon.svelte';
	import LockOpenIcon from './icons/LockOpenIcon.svelte';
	import ClipboardDocumentListIcon from './icons/ClipboardDocumentListIcon.svelte';
	import { toastStore, type ToastSettings } from '@skeletonlabs/skeleton';

	export let textareaId: string;
	export let zoneType: string;
	export let lockFunction: () => boolean;
	let lockState = false;

	const clipboardCopied = () => {
		const t: ToastSettings = {
			message: `Copied ${zoneType} text to clipboard!`,
			// Provide any utility or variant background style:
			background: 'variant-filled-success',
			timeout: 2000
		};
		toastStore.trigger(t);
	};

	const textareaLocked = () => {
		const t: ToastSettings = {
			message: `${zoneType} textarea is ${lockState ? 'locked' : 'unlocked'}!`,
			// Provide any utility or variant background style:
			background: 'variant-filled-success',
			timeout: 2000
		};
		toastStore.trigger(t);
	};
</script>

<div class="input-group input-group-divider grid-cols-[auto_auto] mt-2">
	<button
		class="btn-control variant-filled-primary sep-border"
		title="Copy to clipboard"
		use:clipboard={{ input: textareaId }}
		on:click={clipboardCopied}
	>
		<ClipboardDocumentListIcon />
	</button>
	<button
		class="btn-control variant-filled-primary"
		title="Lock the textarea"
		on:click={() => {
			lockState = lockFunction();
			textareaLocked();
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
