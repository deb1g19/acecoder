import parserBabel from 'prettier/parser-babel.js';
import parserTypescript from 'prettier/parser-typescript.js';
import parserHtml from 'prettier/parser-html.js';
import parserCss from 'prettier/parser-postcss.js';
import type { Parser } from 'prettier';
import prettier from 'prettier';
import { get, writable } from 'svelte/store';
import { updateFile } from '../filesystem/filesystem';
import { selectedTab, unsavedTabs } from 'src/utils/tabs/tabs';
import { saveTab } from '../tabs/tabs';
import { exercise, testing, write } from '../exercise/exercise';
import type { ToastMessage } from '~shared/types';

/**
 * Supported file extensions.
 */
export const supportedExtensions = ['jsx', 'css', 'js', 'ts', 'html', 'tsx', 'json', 'svelte'];

/**
 * The number of times that the format button has been pressed
 */
export const format = writable<number>(0);
export const save = writable<number>(0);
export const reset = writable<number>(0);

/**
 * The toast message to show to the user. It will disappear several seconds after being set
 */
export const toastMessage = writable<ToastMessage>();

/**
 * Write the contents of the editor to the filesystem and optionally write the filesystem to Firebase
 * @param projectID The project being completed
 */
export const handleSave = async (
	value: string,
	projectID: string,
	silent = false
): Promise<void> => {
	if (value == '') return;
	if (get(testing)) {
		toastMessage.set({ message: 'Unable to save while pending submission', variant: 'danger' });
		return;
	}
	const tab: string = get(selectedTab);

	saveTab(tab);
	updateFile(tab, value);
	if (get(exercise).writable) await write(projectID);
	if (!silent) {
		toastMessage.set({ message: 'Saved successfully', variant: 'info' });
	}
};

/**
 * Use Prettier to format a string
 *
 * @param value The text to format
 * @param language The extension of the file being formatted
 * @returns The formatted text
 */
export const handleFormat = (value: string, extension: string): string => {
	if (isSupported(extension)) {
		let formatted: string;
		try {
			if (extension == 'json') {
				formatted = JSON.stringify(JSON.parse(value), null, 2);
			} else {
				formatted = prettier.format(value, getParser(extension));
			}
		} catch (err) {
			toastMessage.set({ message: 'Auto-formatting failed', variant: 'danger' });
			return value;
		}
		if (formatted == value) {
			toastMessage.set({ message: 'Already formatted', variant: 'info' });
		} else {
			toastMessage.set({ message: 'Formatted successfully', variant: 'info' });
		}

		return formatted;
	} else {
		toastMessage.set({ message: `${extension} files aren't supported`, variant: 'danger' });
	}
	return value;
};

/**
 * Get the Prettier parser for a given language
 *
 * @param language The language to get the parser for
 * @returns A Prettier language parser
 */
export const getParser = (
	language: string
): { parser: string; plugins: [{ parsers: { [key: string]: Parser<string> } }] } => {
	switch (language) {
		case 'svelte':
		case 'html':
			return {
				parser: 'html',
				plugins: [parserHtml]
			};
		case 'css':
			return {
				parser: 'css',
				plugins: [parserCss]
			};
		case 'tsx':
			return {
				parser: 'babel-ts',
				plugins: [parserBabel]
			};
		case 'ts':
			return {
				parser: 'typescript',
				plugins: [parserTypescript]
			};

		default:
			return {
				parser: 'babel',
				plugins: [parserBabel]
			};
	}
};

/**
 * Check if a given language is supported.
 *
 * @param language The file extension of the language to check.
 * @returns Whether the language is supported.
 */
export const isSupported = (language: string): boolean => {
	return supportedExtensions.includes(language);
};
