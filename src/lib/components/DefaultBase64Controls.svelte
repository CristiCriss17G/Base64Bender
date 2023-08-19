<script lang="ts">
	import { clipboard } from '@skeletonlabs/skeleton';
	import LockClosedIcon from './icons/LockClosedIcon.svelte';
	import LockOpenIcon from './icons/LockOpenIcon.svelte';
	import ClipboardDocumentListIcon from './icons/ClipboardDocumentListIcon.svelte';
	import { toastStore, type ToastSettings } from '@skeletonlabs/skeleton';

	export let textareaId: string;
	export let zoneType: string;
	export let lockFunction: () => boolean;
	export let valueChanger: (value: string) => void;

	let lockState = false;
	let isDragging: boolean = false;

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

	// file upload
	let file: File | null = null;
	function processFiles(files: FileList) {
		if (files && files.length > 0) {
			file = files[0];
			console.log(file);
			const reader = new FileReader();

			reader.onload = (e) => {
				valueChanger(e.target?.result as string);
			};

			reader.readAsText(file);
		}
	}

	function handleFileChange(event: Event) {
		console.log(typeof event);
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			processFiles(input.files);
		}
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		isDragging = false;
		if (event.dataTransfer && event.dataTransfer.files) {
			processFiles(event.dataTransfer.files);
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		isDragging = true;
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		isDragging = false;
	}
</script>

<slot name="textareaControls" {handleDrop} {handleDragOver} {handleDragLeave} {isDragging} />

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

<div class="mt-2 flex flex-col md:flex-row gap-2">
	<input class="input" type="file" on:change={handleFileChange} />
	<div class="input-group input-group-divider grid-cols-[auto_auto]">
		<button
			class="btn-control variant-filled-primary"
			title="Lock the textarea"
			on:click={() => {
				lockState = lockFunction();
				textareaLocked();
			}}
		>
			Download
		</button>
		<input type="text" placeholder="filename.txt" />
	</div>
</div>

<slot name="additionalControls" />

<style lang="postcss">
	.btn-control {
		@apply !justify-center p-2;

		&.sep-border {
			@apply border-solid border-e border-e-primary-100;
		}
	}
</style>
