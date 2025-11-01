<script lang="ts">
	import type { UserSettings } from '$lib/types/userSettings';

	import { userSettings } from '$lib/stores/userSettings';
	import { MoonIcon, SunIcon } from '@lucide/svelte';
	import { Switch } from '@skeletonlabs/skeleton-svelte';
	import { get } from 'svelte/store';

	// Form Data
	let theme: UserSettings['theme'] = $state(get(userSettings).theme);

	$effect(() => {
		userSettings.set({ ...get(userSettings), theme });
	});
</script>

<Switch
	onCheckedChange={(details) => {
		theme = details.checked ? 'light' : 'dark';
	}}
	defaultChecked={theme === 'light'}
>
	<Switch.Control>
		<Switch.Thumb>
			<Switch.Context>
				{#snippet children(switch_)}
					{#if switch_().checked}
						<SunIcon class="size-3" />
					{:else}
						<MoonIcon class="size-3" />
					{/if}
				{/snippet}
			</Switch.Context>
		</Switch.Thumb>
	</Switch.Control>
	<Switch.HiddenInput />
</Switch>
