<script lang="ts">
	import ColorThemeSwitcher from './ColorThemeSwitcher.svelte';
	import LightSwitch from './LightSwitch.svelte';
	import UserSettingsMenu from './UserSettingsMenu.svelte';

	interface Props {
		isMobile?: boolean;
	}

	let { isMobile = false }: Props = $props();
</script>

{#if isMobile}
	<div class="container flex h-full flex-col place-content-center place-items-center gap-4 p-10">
		<LightSwitch />
		<ColorThemeSwitcher />
		<UserSettingsMenu />
		<a
			class="btn hover:preset-tonal"
			href="https://github.com/CristiCriss17G/Base64Bender"
			target="_blank"
			rel="noreferrer"
		>
			GitHub
		</a>
	</div>
{:else}
	<LightSwitch />
	<ColorThemeSwitcher />
	<UserSettingsMenu />
	<a
		class="btn preset-tonal btn-sm"
		href="https://github.com/CristiCriss17G/Base64Bender"
		target="_blank"
		rel="noreferrer"
	>
		GitHub
	</a>
{/if}
