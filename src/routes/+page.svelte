<script lang="ts">
	import Base64Encoder from '$lib/components/Base64Encoder.svelte';
	import Base64Decoder from '$lib/components/Base64Decoder.svelte';
	import { originalText, base64Text, fromBase64, toBase64 } from '$lib/stores/base64stores';
</script>

<svelte:head>
	<title>Base64Bender - Base 64 Encoder and Decoder</title>
	<meta name="description" content="Base 64 Encoder and decoder" />
	<meta name="keywords" content="base64, encoder, decoder, base64bender" />
	<meta name="author" content="Base64Bender" />
	<meta name="robots" content="index, follow" />
</svelte:head>

<div class="main-container">
	<section class="main-column">
		<h2 class="h2">Base64 Encoder</h2>
		<Base64Encoder value={base64Text} base64EncoderFunction={fromBase64} />
	</section>
	<hr class="!border-t-4 border-slate-500 divider w-11/12 mx-auto md:hidden" />
	<section class="main-column">
		<h2 class="h2">Base64 Decoder</h2>
		<Base64Decoder value={originalText} base64DecoderFunction={toBase64} />
	</section>
</div>

<style lang="postcss">
	.main-container {
		@apply container h-full mx-auto flex flex-col md:flex-row justify-center items-start;
	}
	.main-column {
		@apply p-5 md:p-10 text-center flex flex-col items-center w-full md:w-1/2;
	}
</style>
