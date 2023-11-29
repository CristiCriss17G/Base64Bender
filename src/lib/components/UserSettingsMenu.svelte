<script lang="ts">
	// Props
	/** Exposes parent props to this component. */
	import type { ModalProps } from '@skeletonlabs/skeleton/dist/utilities/Modal/Modal.svelte';
	export let parent: ModalProps;

	// Types
	import type { UserSettings } from '$lib/types/userSettings';

	import { get } from 'svelte/store';

	// Stores
	import { SlideToggle, getModalStore } from '@skeletonlabs/skeleton';
	import { userSettings } from '$lib/stores/userSettings';

	const modalStore = getModalStore();

	// Form Data
	const formData: UserSettings = get(userSettings);

	// We've created a custom submit function to pass the response and close the modal.
	function onFormSubmit(): void {
		if ($modalStore[0].response) $modalStore[0].response(formData);
		userSettings.set(formData);
		modalStore.close();
	}

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<!-- Enable for debugging: -->
		<form class="modal-form {cForm}">
			<aside class="alert">
				<div class="alert-message">
					<p>Right click to paste</p>
				</div>
				<div class="alert-actions">
					<SlideToggle name="rightClickPaste" bind:checked={formData.rightClickPaste} />
				</div>
			</aside>
		</form>

		<slot />

		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}
				>{parent.buttonTextCancel}</button
			>
			<button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Save</button>
		</footer>
	</div>
{/if}
