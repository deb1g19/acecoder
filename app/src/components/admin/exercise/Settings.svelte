<script lang="ts">
	import Checkbox from 'src/components/common/Checkbox.svelte';
	import Input from 'src/components/common/Input.svelte';
	import type { Exercise } from '~shared/types';
	import { createEventDispatcher } from 'svelte';

	export let exercise: Exercise;
	export let editing: boolean;

	const dispatch = createEventDispatcher();

	function toggleEdit() {
		dispatch('edit');
	}
</script>

<div class="space-y-2">
	<div class="flex flex-row justify-between items-center">
		<p class="text-xl font-bold">Settings</p>
		{#if !editing}
			<p class="text-brand-primary cursor-pointer" on:click={toggleEdit}>Edit</p>
		{/if}
	</div>
	<div class="space-y-2">
		<div>
			<p class="font-bold">Name</p>
			{#if editing}
				<Input variant="dark" bind:value={exercise.name} />
			{:else}
				<p>{exercise.name}</p>
			{/if}
		</div>
		<div>
			<p class="font-bold">Evaluation</p>
			<div class="flex flex-row items-center space-x-3">
				<p>This exercise is assessed</p>
				<Checkbox
					bind:value={exercise.assessed}
					variant="true-false"
					disabled={!editing}
					on:click={() => {
						exercise.assessed = !exercise.assessed;
						exercise = exercise;
					}}
				/>
			</div>
		</div>
		<div>
			<p class="font-bold">Description</p>
			{#if editing}
				<textarea
					class="bg-brand-background rounded p-2 w-full h-28"
					name="introduction"
					bind:value={exercise.description}
				/>
			{:else}
				<p>{@html exercise.description}</p>
			{/if}
		</div>
		<div>
			<p class="font-bold">Previous exercise</p>
			<div class="flex flex-row items-center space-x-3">
				<p>This exercise inherits from a previous exercise</p>
				<Checkbox
					bind:value={exercise.inherits}
					variant="true-false"
					disabled={!editing}
					on:click={() => {
						exercise.inherits = !exercise.inherits;
						exercise = exercise;
					}}
				/>
			</div>
		</div>
		<div>
			<p class="font-bold">Writable</p>
			<div class="flex flex-row items-center space-x-3">
				<p>This exercise is writable</p>
				<Checkbox
					bind:value={exercise.writable}
					variant="true-false"
					disabled={!editing}
					on:click={() => {
						exercise.writable = !exercise.writable;
						exercise = exercise;
					}}
				/>
			</div>
		</div>
	</div>
</div>
