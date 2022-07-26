import { get, writable } from 'svelte/store';
import type { FSFile } from '~shared/types';
import { getFile } from '../filesystem/filesystem';

// open editors
export const tabs = writable<string[]>([]);
export const selectedTab = writable<string>('');

export const unsavedTabs = writable<string[]>([]);

// If current tab is a temp tab, it should be replaced with the latest tab to be opened.

/**
 * Create a new tab if it doesn't exist and select it.
 * @param path The path to the file for this tab.
 */
export const openTab = (path: string): void => {
	tabs.update((tabs) => {
		if (tabs.includes(path)) {
			return tabs;
		} else {
			// Insert the tab to the right of the selected tab
			tabs.splice(tabs.indexOf(get(selectedTab)) + 1, 0, path);
			return tabs;
		}
	});
	// Select the newly created tab
	selectedTab.set(path);
};

/**
 * Update all tabs that are files in some parent directory by renaming
 * the parent directory.
 *
 * @param oldDir The directory name to search for.
 * @param newDir What the directory name should be replaced with.
 */
export const renameTabs = (oldDir: string, newDir: string): void => {
	tabs.update((tabs) =>
		tabs.map((path) => (path.startsWith(oldDir + '/') ? path.replace(oldDir, newDir) : path))
	);
	selectedTab.update((selected) => {
		if (selected.startsWith(oldDir + '/')) {
			return selected.replace(oldDir, newDir);
		}
		return selected;
	});
};

/**
 * Rename a tab exactly matching the given name.
 * @param oldName The name to replace.
 * @param newName The new name to use.
 */
export const renameTab = (oldName: string, newName: string): void => {
	tabs.update((tabs) => {
		if (tabs.includes(oldName)) {
			tabs[tabs.indexOf(oldName)] = newName;
		}
		return tabs;
	});
	selectedTab.set(newName);
	// Update the language support for this tab.
};

/**
 * Closes a tab.
 * @param name The name of the tab to close.
 */
export const closeTab = (name: string): void => {
	tabs.update((tabs) => {
		// Update the selected tab
		let index = tabs.indexOf(name);
		if (tabs.length > 1) {
			// If this is the last tab, select the second last tab
			// If this is the first tab select the second tab
			// Else, select the tab to the right of this one
			if (index == tabs.length - 1) {
				index = tabs.length - 2;
			} else if (index == 0) {
				index = 1;
			} else {
				index += 1;
			}
			selectedTab.set(tabs[index]);
		} else {
			selectedTab.set('');
		}

		// Remove this tab
		if (tabs.includes(name)) {
			tabs.splice(tabs.indexOf(name), 1);
		}

		return tabs;
	});
	unsavedTabs.update((tabs) => {
		if (tabs.includes(name)) {
			tabs.splice(tabs.indexOf(name), 1);
		}
		return tabs;
	});
};

/**
 * Close all tabs that are files in some parent directory.
 * @param parent The name of the directory.
 */
export const closeTabs = (parent: string): void => {
	tabs.update((tabs) => tabs.filter((path) => !path.startsWith(parent)));
};

/**
 * Marks a tab as saved and removes it from unsaved tabs.
 * @param name The name of the tab
 */
export const saveTab = (name: string): void => {
	unsavedTabs.update((unsavedTabs) =>
		unsavedTabs.includes(name) ? unsavedTabs.filter((t) => t != name) : unsavedTabs
	);
};

/**
 * Rearrange tabs such that source is immediately to the left of target
 *
 * @param target The tab to move to the left of
 * @param source The tab being moved
 */
export const rearrange = (target: string, source: string): void => {
	tabs.update((tabs) => {
		tabs = tabs.filter((t) => t != source);
		const targetIndex = tabs.indexOf(target);
		tabs.splice(targetIndex, 0, source);
		return tabs;
	});
};

/**
 * Update the list of unsaved tabs with the current tab.
 *
 * @param filename The name of the current tab
 */
export const updateUnsaved = (filename: string, value: string): void => {
	if (!get(unsavedTabs).includes(filename)) {
		unsavedTabs.update((tabs) => [...tabs, filename]);
	} else if (value === (getFile(filename) as FSFile).value) {
		unsavedTabs.update((tabs) => {
			tabs.splice(tabs.indexOf(filename));
			return tabs;
		});
	}
};
