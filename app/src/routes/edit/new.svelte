<script lang="ts">
	import ProfileImage from 'src/components/profile/ProfileImage.svelte';
	import ProjectSettings from 'src/components/admin/ProjectSettings.svelte';
	import PrivateRoute from 'src/components/auth/PrivateRoute.svelte';
</script>

<svelte:head>
	<title>New project - Acecoder</title>
</svelte:head>

<PrivateRoute restricted={true}>
	<div
		class="w-screen min-h-screen bg-brand-background flex justify-center items-center text-brand-text overflow-y-auto"
	>
		<div class="flex-grow lg:max-w-6xl h-full px-20 py-10 space-y-8">
			<div class="flex flex-row items-center justify-between">
				<p class="text-3xl font-bold">New project</p>
				<ProfileImage />
			</div>
			<ProjectSettings creating={true} />
		</div>
	</div>
</PrivateRoute>
