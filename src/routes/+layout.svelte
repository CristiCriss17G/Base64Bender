<script lang="ts">
	import '../app.css';
	import { AppBar } from '@skeletonlabs/skeleton-svelte';

	let { children } = $props();

	import { browser } from '$app/environment';
	import Base64Bender from '$lib/components/icons/Base64Bender.svelte';
	import MainMenu from '$lib/components/MainMenu.svelte';
	import SideMenu from '$lib/components/SideMenu.svelte';
	import { initThemeChanger } from '$lib/helpers/themeChanger';
	import { toaster } from '$lib/stores/toastStore';
	import { userSettings } from '$lib/stores/userSettings';
	import { Toast } from '@skeletonlabs/skeleton-svelte';
	import { onMount } from 'svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import { pwaInfo } from 'virtual:pwa-info';

	const mediaQuery = new MediaQuery('min-width: 768px', true);

	let webManifestLink = $derived(
		pwaInfo ? pwaInfo.webManifest.linkTag.replace('href="/', 'href="./') : ''
	);

	$effect(() => {
		if (browser) {
			document.documentElement.dataset.theme = $userSettings.colorTheme;
		}
	});

	onMount(() => {
		if (browser) {
			const prefersDark = globalThis.matchMedia('(prefers-color-scheme: dark)');

			initThemeChanger(prefersDark);
		}
	});
</script>

<svelte:head>
	<title>Base64Bender - Base 64 Encoder and Decoder</title>

	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html webManifestLink}
</svelte:head>

<Toast.Group {toaster}>
	{#snippet children(toast)}
		<Toast {toast}>
			<Toast.Message>
				<Toast.Title>{toast.title}</Toast.Title>
				<Toast.Description>{toast.description}</Toast.Description>
			</Toast.Message>
			<Toast.CloseTrigger />
		</Toast>
	{/snippet}
</Toast.Group>

<!-- App Shell -->
<div class="grid h-screen grid-rows-[auto_1fr]">
	<!-- Header -->
	<header class="sticky top-0 z-10 backdrop-blur-sm">
		<AppBar>
			<AppBar.Toolbar class="grid-cols-[auto_1fr_auto]">
				<AppBar.Lead>
					<Base64Bender sizeClasses="w-10 h-10" />
				</AppBar.Lead>
				<AppBar.Headline>
					<h1 class="text-xl font-bold uppercase">Base64Bender</h1>
				</AppBar.Headline>
				<AppBar.Trail>
					{#if mediaQuery.current}
						<MainMenu />
					{:else}
						<SideMenu />
					{/if}
				</AppBar.Trail>
			</AppBar.Toolbar>
		</AppBar>
	</header>
	<!-- Page Route Content -->
	<div class="grid h-full grid-cols-[1fr] overflow-hidden">
		<!-- Page Route Content -->
		<div class="overflow-x-hidden overflow-y-auto">
			<main class="container mx-auto">
				{@render children?.()}
			</main>
		</div>
	</div>
</div>
