<script lang="ts">
	import ProfileMenu from '../profile/ProfileMenu.svelte';
	import Logo from './Logo.svelte';

	/**
	 * Whether the profile menu should be shown
	 */
	export let showProfile: boolean = true;

	/**
	 * Whether this navbar should span the width of the screen
	 */
	export let expanded: boolean = false;
</script>

<div class="bg-brand-accent w-full flex justify-center py-1 h-14">
	<div
		class="flex justify-between items-center w-full h-full py-2 {expanded
			? 'px-5'
			: 'px-20 lg:max-w-6xl'}"
	>
		<div class="flex space-x-8 items-center">
			<Logo variant="light" />
			<a href="/dashboard" class="hover:text-brand-primary-light transition-colors">Dashboard</a>
		</div>
		{#if showProfile}
			<ProfileMenu />
		{/if}
	</div>
</div>
