<script lang="ts">
	import { onMount } from 'svelte';

	interface ChildrenProps {
		matches: boolean;
	}

	interface Props {
		query: string;
		children?: import('svelte').Snippet<[ChildrenProps]>;
	}

	let { query, children }: Props = $props();

	let mql: MediaQueryList;
	let mqlListener: ((this: MediaQueryList, ev: MediaQueryListEvent) => boolean) | null;
	let wasMounted = $state(false);
	let matches = $state(false);

	onMount(() => {
		wasMounted = true;
		return () => {
			removeActiveListener();
		};
	});

	function addNewListener(query: string) {
		mql = window.matchMedia(query);
		mqlListener = (v) => (matches = v.matches);
		mql.addEventListener('change', mqlListener);
		matches = mql.matches;
	}

	function removeActiveListener() {
		if (mql && mqlListener) {
			mql.removeEventListener('change', mqlListener);
		}
	}
	$effect(() => {
		if (wasMounted) {
			removeActiveListener();
			addNewListener(query);
		}
	});
</script>

{@render children?.({ matches })}
