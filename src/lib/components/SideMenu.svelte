<script lang="ts">
	import { Menu } from '@lucide/svelte';
	import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';

	import MainMenu from './MainMenu.svelte';
</script>

<Dialog>
	<Dialog.Trigger class="mr-4 btn btn-sm md:hidden"><Menu /></Dialog.Trigger>
	<Portal>
		<Dialog.Backdrop
			class="fixed inset-0 z-50 bg-surface-50-950/50 opacity-0 transition transition-discrete data-[state=open]:opacity-100 starting:data-[state=open]:opacity-0"
		/>
		<Dialog.Positioner class="fixed inset-0 z-50 flex justify-start">
			<Dialog.Content
				class="h-screen w-sm -translate-x-full space-y-4 card bg-surface-100-900 p-4 opacity-0 shadow-xl transition transition-discrete data-[state=open]:translate-x-0 data-[state=open]:opacity-100 starting:data-[state=open]:-translate-x-full starting:data-[state=open]:opacity-0"
			>
				<MainMenu isMobile={true} />
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog>
