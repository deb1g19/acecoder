/* eslint-disable sonarjs/no-duplicate-string */
import { get } from 'svelte/store';
import { closeTab, openTab, renameTab, selectedTab, tabs, unsavedTabs } from './tabs';

describe('The tabs library', () => {
	beforeEach(() => {
		tabs.set([]);
		selectedTab.set('');

		unsavedTabs.set([]);
	}),
		it('can open a tab', () => {
			openTab('index.tsx');
			expect(get(tabs)).toStrictEqual(['index.tsx']);
		});
	it('can close a tab', () => {
		openTab('index.tsx');
		expect(get(tabs)).toStrictEqual(['index.tsx']);
		closeTab('index.tsx');
		expect(get(tabs)).toStrictEqual([]);
	});
	it('can rename a tab', () => {
		openTab('index.tsx');
		renameTab('index.tsx', 'test.tsx');
		expect(get(tabs)).toStrictEqual(['test.tsx']);
	});
	it('updates the selected tab', () => {
		openTab('index.tsx');
		expect(get(selectedTab)).toBe('index.tsx');
		openTab('index.tsx');
		openTab('anotherTab.tsx');
		expect(get(selectedTab)).toBe('anotherTab.tsx');
		closeTab('anotherTab.tsx');
		expect(get(selectedTab)).toStrictEqual('index.tsx');
		closeTab('index.tsx');
		expect(get(selectedTab)).toStrictEqual('');
	});
});
