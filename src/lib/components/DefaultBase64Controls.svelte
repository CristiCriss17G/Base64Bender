<script lang="ts">
	import { clipboard } from '@skeletonlabs/skeleton';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';

	import ClipboardDocumentListIcon from './icons/ClipboardDocumentListIcon.svelte';
	import DocumentMinus from './icons/DocumentMinus.svelte';
	import LockClosedIcon from './icons/LockClosedIcon.svelte';
	import LockOpenIcon from './icons/LockOpenIcon.svelte';

	interface TextAreaControlsProps {
		handleDrop: (event: DragEvent) => void;
		handleDragOver: (event: DragEvent) => void;
		handleDragLeave: (event: DragEvent) => void;
		isDragging: boolean;
		fileDropClassesActive: string;
	}

	interface Props {
		textareaId: string;
		zoneType: string;
		lockFunction: () => boolean;
		valueChanger: (value: string) => void;
		textValue: string;
		textareaControls?: import('svelte').Snippet<[TextAreaControlsProps]>;
		additionalControls?: import('svelte').Snippet;
	}

	let {
		textareaId,
		zoneType,
		lockFunction,
		valueChanger,
		textValue,
		textareaControls,
		additionalControls
	}: Props = $props();

	const toastStore = getToastStore();
	let lockState = $state(false);
	let isDragging: boolean = $state(false);
	const fileDropClasses: string = 'outline-4 outline-dashed';
	let fileDropClassesActive: string = $state('');

	const clipboardCopied = () => {
		const t: ToastSettings = {
			// Provide any utility or variant background style:
			background: 'variant-filled-success',
			message: `Copied ${zoneType} text to clipboard!`,
			timeout: 2000
		};
		toastStore.trigger(t);
	};

	const textareaLocked = () => {
		const t: ToastSettings = {
			// Provide any utility or variant background style:
			background: 'variant-filled-success',
			message: `${zoneType} textarea is ${lockState ? 'locked' : 'unlocked'}!`,
			timeout: 2000
		};
		toastStore.trigger(t);
	};

	// file upload
	const allowedExtensions = [
		'.txt',
		'.json',
		'.yaml',
		'.yml',
		'.xml',
		'.csv',
		'.html',
		'.log',
		'.md',
		'.markdown',
		'.pem',
		'.crt',
		'.key',
		'.csr',
		'.cer',
		'.pfx',
		'.p12',
		'.der',
		'.p7b',
		'.p7c',
		'.p7r',
		'.p7m',
		'.p7s',
		'.p8'
	];

	function isValidFileExtension(filename: string): boolean {
		const ext = '.' + filename.split('.').pop();
		return allowedExtensions.includes(ext.toLowerCase());
	}

	function isBinary(data: string): boolean {
		return data.includes('\0');
	}

	let file: File | null = null;
	function processFiles(files: FileList) {
		if (files && files.length > 0) {
			file = files[0];
			if (!isValidFileExtension(file.name)) {
				const t: ToastSettings = {
					// Provide any utility or variant background style:
					background: 'variant-filled-error',
					message: `Invalid file type!<br />Allowed file types: ${allowedExtensions.join(', ')}`,
					timeout: 3000
				};
				toastStore.trigger(t);
				return;
			}
			const reader = new FileReader();

			reader.onload = (e) => {
				const data = e.target?.result as string;
				if (isBinary(data)) {
					const t: ToastSettings = {
						// Provide any utility or variant background style:
						background: 'variant-filled-error',
						message: `Binary file detected!`,
						timeout: 2000
					};
					toastStore.trigger(t);
				} else {
					valueChanger(data);
				}
			};

			reader.readAsText(file);
		}
	}

	function handleFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			processFiles(input.files);
		}
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		isDragging = false;
		fileDropClassesActive = '';
		if (event.dataTransfer && event.dataTransfer.files) {
			processFiles(event.dataTransfer.files);
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		isDragging = true;
		fileDropClassesActive = fileDropClasses;
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		isDragging = false;
		fileDropClassesActive = '';
	}

	// save to file
	let downloadFilename = $state('');
	function saveToFile() {
		const normalizedText = textValue.replace(/\r\n/g, '\n');
		const blob = new Blob([normalizedText], { type: 'text/plain' });
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = downloadFilename.length > 0 ? downloadFilename : 'filename.txt';
		link.click();
		URL.revokeObjectURL(link.href);
		// downloadFilename = '';
	}
</script>

{@render textareaControls?.({
	handleDrop,
	handleDragOver,
	handleDragLeave,
	isDragging,
	fileDropClassesActive
})}

<div class="input-group input-group-divider grid-cols-[auto_auto_auto] mt-2">
	<button
		class="btn-control variant-filled-primary sep-border"
		title="Copy to clipboard"
		use:clipboard={{ input: textareaId }}
		onclick={clipboardCopied}
	>
		<ClipboardDocumentListIcon />
	</button>
	<button
		class="btn-control variant-filled-primary sep-border"
		title="Lock the textarea"
		onclick={() => {
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
	<button
		class="btn-control variant-filled-primary"
		title="Clear"
		onclick={() => {
			valueChanger('');
		}}
	>
		<DocumentMinus />
	</button>
</div>

<div class="mt-2 flex flex-col md:flex-row gap-2">
	<input class="input" type="file" onchange={handleFileChange} />
	<div class="input-group input-group-divider grid-cols-[auto_auto]">
		<button class="btn-control variant-filled-primary" title="Save to file" onclick={saveToFile}>
			Download
		</button>
		<input type="text" placeholder="filename.txt" bind:value={downloadFilename} />
	</div>
</div>

{@render additionalControls?.()}

<style lang="postcss">
	.btn-control {
		@apply !justify-center p-2;

		&.sep-border {
			@apply border-solid border-e border-e-primary-100;
		}
	}
</style>
