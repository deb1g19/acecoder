<script lang="ts">
	import type { WorkerError } from '~shared/types';
	import IoMdClose from 'svelte-icons/io/IoMdClose.svelte';
	import Icon from 'src/components/common/Icon.svelte';

	/**
	 * The error to display.
	 */
	export let error: WorkerError | undefined;

	/**
	 * Dismiss this error.
	 */
	function close() {
		error = undefined;
	}
</script>

{#if error}
	<div class="z-10 absolute inset-0 bg-opacity-50 bg-white p-5 overflow-y-auto w-full">
		<div class="flex flex-row justify-between">
			<p class="text-red-600 text-lg font-bold">{error.name}</p>
			<Icon button={true} on:click={close} testId="close-error"><IoMdClose /></Icon>
		</div>
		<pre class="whitespace-pre-wrap">{error.message}</pre>
	</div>
{/if}
