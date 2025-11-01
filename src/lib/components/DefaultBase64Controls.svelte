<script lang="ts">
	import { toaster } from '$lib/stores/toastStore';
	import { ClipboardList, FileMinus, Lock, LockOpen } from '@lucide/svelte';

	interface TextAreaControlsProps {
		fileDropClassesActive: string[];
		handleDragLeave: (event: DragEvent) => void;
		handleDragOver: (event: DragEvent) => void;
		handleDrop: (event: DragEvent) => void;
		isDragging: boolean;
	}

	interface Props {
		additionalControls?: import('svelte').Snippet;
		lockFunction: () => boolean;
		textareaControls?: import('svelte').Snippet<[TextAreaControlsProps]>;
		textareaId: string;
		textValue: string;
		valueChanger: (value: string) => void;
		zoneType: string;
	}

	let {
		additionalControls,
		lockFunction,
		textareaControls,
		textareaId,
		textValue,
		valueChanger,
		zoneType
	}: Props = $props();

	let lockState = $state(false);
	let isDragging: boolean = $state(false);
	const fileDropClasses: string[] = [
		'outline-dashed',
		'outline-current',
		'outline-offset-2',
		'outline-4'
	];
	let fileDropClassesActive: string[] = $state([]);
	let textarea: HTMLTextAreaElement | null = null;

	async function clipboardCopy() {
		if (!textarea) {
			textarea = document.getElementById(textareaId) as HTMLTextAreaElement;
		}
		textarea.select();
		if (!textarea.value) {
			toaster.error({
				description: `There is no ${zoneType} text to copy!`,
				duration: 2000,
				title: 'Empty Textarea'
			});
			return;
		}
		await navigator.clipboard.writeText(textarea.value);
		toaster.success({
			description: `Copied ${zoneType} text to clipboard!`,
			duration: 2000,
			title: 'Copied'
		});
	}

	function textareaLocked() {
		toaster.success({
			description: `${zoneType} textarea is ${lockState ? 'locked' : 'unlocked'}!`,
			duration: 2000,
			title: lockState ? 'Locked' : 'Unlocked'
		});
	}

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
				toaster.error({
					description: `Allowed file types: ${allowedExtensions.join(', ')}`,
					duration: 3000,
					title: 'Invalid File Type'
				});
				return;
			}
			const reader = new FileReader();

			reader.onload = (e) => {
				const data = e.target?.result as string;
				if (isBinary(data)) {
					toaster.error({
						description: `The uploaded file appears to be a binary file and cannot be processed.`,
						duration: 2000,
						title: 'Binary File Detected'
					});
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
		fileDropClassesActive = [];
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
		fileDropClassesActive = [];
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
	fileDropClassesActive,
	handleDragLeave,
	handleDragOver,
	handleDrop,
	isDragging
})}

<div class="mt-2 input-group grid-cols-[auto_auto_auto]">
	<button
		class="ig-btn justify-center! border-e border-solid border-e-primary-100 preset-filled-primary-500 p-2"
		title="Copy to clipboard"
		onclick={clipboardCopy}
	>
		<ClipboardList />
	</button>
	<button
		class="ig-btn justify-center! border-e border-solid border-e-primary-100 preset-filled-primary-500 p-2"
		title="Lock the textarea"
		onclick={() => {
			lockState = lockFunction();
			textareaLocked();
		}}
	>
		{#if lockState}
			<Lock />
		{:else}
			<LockOpen />
		{/if}
	</button>
	<button
		class="ig-btn justify-center! preset-filled-primary-500 p-2"
		title="Clear"
		onclick={() => {
			valueChanger('');
		}}
	>
		<FileMinus />
	</button>
</div>

<div class="mt-2 flex flex-col gap-2 md:flex-row">
	<input class="input" type="file" onchange={handleFileChange} />
	<div class="input-group grid-cols-[auto_auto]">
		<button
			class="ig-btn justify-center! preset-filled-primary-500 p-2"
			title="Save to file"
			onclick={saveToFile}
		>
			Download
		</button>
		<input class="ig-input" type="text" placeholder="filename.txt" bind:value={downloadFilename} />
	</div>
</div>

{@render additionalControls?.()}
