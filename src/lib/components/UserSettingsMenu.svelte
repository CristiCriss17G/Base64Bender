<script lang="ts">
	// Types
	import type { UserSettings } from '$lib/types/userSettings';

	import { userSettings } from '$lib/stores/userSettings';
	import { Settings } from '@lucide/svelte';
	import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';
	import { Switch } from '@skeletonlabs/skeleton-svelte';
	import { get } from 'svelte/store';

	let theme: UserSettings['theme'] = $state(get(userSettings).theme);
	let rightClickPaste: UserSettings['rightClickPaste'] = $state(get(userSettings).rightClickPaste);

	userSettings.subscribe((settings) => {
		theme = settings.theme;
		rightClickPaste = settings.rightClickPaste;
	});

	$effect(() => {
		userSettings.set({ ...get(userSettings), rightClickPaste, theme });
	});
</script>

<Dialog>
	<Dialog.Trigger class="btn hover:rotate-45"><Settings /></Dialog.Trigger>
	<Portal>
		<Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/50" />
		<Dialog.Positioner class="fixed inset-0 z-50 flex items-center justify-center">
			<Dialog.Content class="w-md space-y-2 card bg-surface-100-900 p-4 shadow-xl">
				<Dialog.Title class="text-2xl font-bold">User Settings</Dialog.Title>
				<Dialog.Description>
					<div class="rounded-container-token space-y-4 border border-surface-500 p-4">
						<aside class="alert flex justify-between">
							<div class="alert-message">
								<p>Right click to paste</p>
							</div>
							<div class="alert-actions">
								<Switch
									name="rightClickPaste"
									onCheckedChange={(details) => (rightClickPaste = details.checked)}
								>
									<Switch.Control class="data-[state=checked]:preset-filled-success-500">
										<Switch.Thumb />
									</Switch.Control>
									<Switch.HiddenInput />
								</Switch>
							</div>
						</aside>
						<aside class="alert flex justify-between">
							<div class="alert-message">
								<p>Reset color theme to system</p>
							</div>
							<div class="alert-actions">
								<button type="button" class="btn preset-filled" onclick={() => (theme = null)}
									>Reset</button
								>
							</div>
						</aside>
					</div>
				</Dialog.Description>
				<Dialog.CloseTrigger class="btn preset-tonal">Close</Dialog.CloseTrigger>
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog>
