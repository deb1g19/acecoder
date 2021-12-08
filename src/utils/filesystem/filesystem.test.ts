import { tail, navigateToFile, getExistingFiles, filesystem } from './filesystem';
import type { Filesystem } from '../types';

describe('The Filesystem utility', () => {
	it('retrieves the filename of a file', () => {
		let name = tail('src/index.tsx');
		expect(name).toBe('index.tsx');

		name = tail('package.json');
		expect(name).toBe('package.json');
	});
	it('retrieves the parent directory of a given file', () => {
		const files: Filesystem = {
			test: {
				type: 'file',
				value: ''
			},
			'package.json': {
				type: 'file',
				value: ''
			}
		};
		filesystem.set(files);
		expect(navigateToFile('test')).toBe(files);
	});
	it('retreives the top level filenames of a given directory', () => {
		const files: Filesystem = {
			test: {
				type: 'file',
				value: ''
			},
			'package.json': {
				type: 'file',
				value: ''
			}
		};
		expect(getExistingFiles(files).toString()).toBe(['test', 'package.json'].toString());
	});
});
