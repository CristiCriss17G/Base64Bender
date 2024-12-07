<script lang="ts">
	import type { ColorTheme } from '$lib/types/userSettings';

	import { capitalizeFirstLetter } from '$lib/helpers/strings';
	import { userSettings } from '$lib/stores/userSettings';

	const options: ColorTheme[] = ['crimson', 'hamlindigo', 'modern', 'vintage', 'wintry'];
</script>

<div>
	<select class="select max-w-32" bind:value={$userSettings.colorTheme}>
		{#each options as option}
			<option value={option}>{capitalizeFirstLetter(option)}</option>
		{/each}
	</select>
</div>
