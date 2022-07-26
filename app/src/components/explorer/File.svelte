<script lang="ts">
	import Trash from 'svelte-icons/io/IoMdTrash.svelte';
	import Hoverable from '../common/Hoverable.svelte';
	import FileIcon from 'svelte-icons/fa/FaRegFile.svelte';
	import Pen from 'svelte-icons/fa/FaPen.svelte';
	import { fade } from 'svelte/transition';
	import ExplorerInput from './ExplorerInput.svelte';
	import {
		tail,
		deleteFile,
		getParentDir,
		getExistingFiles,
		navigateToFile,
		renameFile,
		isExerciseFile
	} from '../../utils/filesystem/filesystem';
	import { closeTab, openTab, renameTab } from '../../utils/tabs/tabs';
	import Icon from '../common/Icon.svelte';
	import Draggable from '../common/Draggable.svelte';
	import { exercise, language } from 'src/utils/exercise/exercise';
	import { onMount } from 'svelte';

	/**
	 * The full path to this file including the filename.
	 */
	export let path: string;

	/**
	 * Whether this file is modifiable
	 */
	let modifiable: boolean = false;

	/**
	 * The depth of this file in the file tree.
	 */
	export let depth = 0;

	/**
	 * Whether the user is renaming this file.
	 */
	let renaming = false;

	/**
	 * Update whether the renaming input field should be shown.
	 * @param isRenaming Whether the user is renaming this file.
	 */
	function setRenaming(isRenaming: boolean) {
		renaming = isRenaming;
	}

	/**
	 * Delete the file when the delete button is pressed.
	 */
	function handleDelete() {
		deleteFile(path);
		closeTab(path);
	}

	/**
	 * Called when the user renames the file.
	 * @param newName The new name for the file.
	 */
	function handleRename(newName: string) {
		if (path.includes('/')) {
			const parent = getParentDir(path);
			rename(parent + '/' + newName);
		} else {
			rename(newName);
		}
		renaming = false;
	}

	/**
	 * Rename this file.
	 * @param name The new name for the file.
	 */
	function rename(name: string) {
		renameFile(path, name);
		renameTab(path, name);
	}

	/**
	 * Called when the user clicks on this file.
	 * Clicking on the file should open a tab to edit the file if there isn't
	 * already a tab open for this file.
	 */
	function handleClick() {
		openTab(path);
	}

	onMount(() => {
		modifiable = !isExerciseFile(path, $exercise, $language);
	});

	$: name = tail(path);
</script>

{#if renaming}
	<ExplorerInput
		reservedNames={getExistingFiles(navigateToFile(path))}
		{depth}
		initialValue={name}
		on:submit={(e) => handleRename(e.detail)}
		on:cancelled={() => setRenaming(false)}
	>
		<Icon>
			<FileIcon />
		</Icon>
	</ExplorerInput>
{:else}
	<Draggable data={path} variant="explorer">
		<Hoverable let:hovering>
			<div
				class="flex transition flex-row items-center space-x-2 text-brand-text py-0.5"
				style="padding-left: {depth * 1}rem;"
				on:click={handleClick}
				role="treeitem"
				aria-label="open file {name}"
				transition:fade={{ duration: 100 }}
			>
				<Icon>
					<FileIcon />
				</Icon>
				<p class="truncate">{name}</p>
				{#if modifiable && hovering}
					<div
						class="flex flex-row dark:text-dark-text justify-end items-center flex-grow pr-2 space-x-1"
						transition:fade={{ duration: 200 }}
					>
						<Icon
							on:click={() => setRenaming(true)}
							testId="rename-file"
							button={true}
							label="Rename"
							aria="rename file {name}"
						>
							<Pen />
						</Icon>
						<Icon
							on:click={handleDelete}
							testId="delete-file"
							button={true}
							label="Delete"
							aria="delete file {name}"
						>
							<Trash />
						</Icon>
					</div>
				{/if}
			</div>
		</Hoverable>
	</Draggable>
{/if}
