<script lang="ts">
	import Base64Decoder from '$lib/components/Base64Decoder.svelte';
	import Base64Encoder from '$lib/components/Base64Encoder.svelte';
	import {
		base64Text,
		initializeUserSettingsUpdate,
		originalText
	} from '$lib/stores/base64stores.svelte';
	import { onMount } from 'svelte';

	const { fromBase64, toBase64 } = initializeUserSettingsUpdate();

	onMount(() => {
		window.addEventListener('dragover', (e: DragEvent) => e.preventDefault());
		window.addEventListener('drop', (e: DragEvent) => e.preventDefault());
		return () => {
			window.removeEventListener('dragover', (e: DragEvent) => e.preventDefault());
			window.removeEventListener('drop', (e: DragEvent) => e.preventDefault());
		};
	});
</script>

<svelte:head>
	<meta name="description" content="Base 64 Encoder and decoder" />
	<meta name="keywords" content="base64, encoder, decoder, base64bender" />
	<meta name="author" content="Base64Bender" />
	<meta name="robots" content="index, follow" />
</svelte:head>

<div class="container mx-auto flex h-full flex-col items-start justify-center md:flex-row">
	<section class="flex w-full flex-col items-center p-5 text-center md:w-1/2 md:p-10">
		<h2 class="h2">Base64 Decoder</h2>
		<Base64Decoder value={base64Text} base64DecoderFunction={fromBase64} />
	</section>
	<hr class="divider mx-auto w-11/12 border-t-4! border-slate-500 md:hidden" />
	<section class="flex w-full flex-col items-center p-5 text-center md:w-1/2 md:p-10">
		<h2 class="h2">Base64 Encoder</h2>
		<Base64Encoder value={originalText} base64EncoderFunction={toBase64} />
	</section>
</div>
