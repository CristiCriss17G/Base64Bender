<script lang="ts">
	// // The ordering of these imports is critical to your app working properly
	// import '@skeletonlabs/skeleton/themes/theme-modern.css';
	// // If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	// import '@skeletonlabs/skeleton/styles/skeleton.css';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';
	import {
		initializeStores,
		AppShell,
		AppBar,
		Drawer,
		getDrawerStore,
		Modal,
		Toast
	} from '@skeletonlabs/skeleton';
	import Bars3 from '$lib/components/icons/Bars3.svelte';
	import MainMenu from '$lib/components/MainMenu.svelte';
	import Base64Bender from '$lib/components/icons/Base64Bender.svelte';

	initializeStores();

	const drawerStore = getDrawerStore();

	import MediaQuery from '$lib/components/MediaQuery.svelte';
	import { pwaInfo } from 'virtual:pwa-info';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	let webManifestLink = $derived(pwaInfo ? pwaInfo.webManifest.linkTag.replace('href="/', 'href="./') : '');

	function drawerOpen() {
		drawerStore.open();
	}
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html webManifestLink}
</svelte:head>

<Toast position="bl" max={4} padding="p-3" />

<Modal />

<Drawer position="right" width="w-1/2">
	<MainMenu isMobile={true} />
</Drawer>

<!-- App Shell -->
<AppShell>
	{#snippet header()}
	
			<!-- App Bar -->
			<AppBar>
				{#snippet lead()}
					
						<Base64Bender sizeClasses="w-10 h-10" />
						<strong class="text-xl uppercase">Base64Bender</strong>
					
					{/snippet}
				{#snippet trail()}
					
						<MediaQuery query="(min-width: 768px)" >
							{#snippet children({ matches })}
										{#if matches}
									<MainMenu />
								{:else}
									<button class="md:hidden btn btn-sm mr-4" onclick={drawerOpen}>
										<Bars3 />
									</button>
								{/if}
																{/snippet}
								</MediaQuery>
					
					{/snippet}
			</AppBar>
		
	{/snippet}
	<!-- Page Route Content -->
	{@render children?.()}
</AppShell>
