const assert = require('assert');
const fs = require('fs');
const path = require('path');
const nexline = require('../index');

describe('Nexline test', async () => {
	it('Stream input test', async () => {
		const nl = nexline({
			input: fs.createReadStream(path.resolve(__dirname, './data/simple.txt')),
		});

		assert.strictEqual('Test Line 1', await nl.next());
		assert.strictEqual('Test Line 2', await nl.next());
		assert.strictEqual('Test Line 3', await nl.next());
		assert.strictEqual('Test Line 4', await nl.next());
		assert.strictEqual('Test Line 5', await nl.next());
		assert.strictEqual(null, await nl.next());
	});

	it('Text input test', async () => {
		const nl = nexline({
			input: '123\r\n456\n789',
		});

		assert.strictEqual('123', await nl.next());
		assert.strictEqual('456', await nl.next());
		assert.strictEqual('789', await nl.next());
		assert.strictEqual(null, await nl.next());
	});

	it('Buffer input test', async () => {
		const nl = nexline({
			input: Buffer.from('123\r\n456\n789'),
		});

		assert.strictEqual('123', await nl.next());
		assert.strictEqual('456', await nl.next());
		assert.strictEqual('789', await nl.next());
		assert.strictEqual(null, await nl.next());
	});

	it('Multiple input test', async () => {
		const nl = nexline({
			input: [
				fs.createReadStream(path.resolve(__dirname, './data/simple.txt')), //
				fs.createReadStream(path.resolve(__dirname, './data/empty.txt')),
				'123\r\n456\n789',
				Buffer.from('123\r\n456\n789'),
			],
			lineSeparator: [';', '\n', '\r\n'],
		});

		assert.strictEqual('Test Line 1', await nl.next());
		assert.strictEqual('Test Line 2', await nl.next());
		assert.strictEqual('Test Line 3', await nl.next());
		assert.strictEqual('Test Line 4', await nl.next());
		assert.strictEqual('Test Line 5', await nl.next());
		assert.strictEqual('', await nl.next());
		assert.strictEqual('123', await nl.next());
		assert.strictEqual('456', await nl.next());
		assert.strictEqual('789', await nl.next());
		assert.strictEqual('123', await nl.next());
		assert.strictEqual('456', await nl.next());
		assert.strictEqual('789', await nl.next());
		assert.strictEqual(null, await nl.next());
	});

	it('Broken buffer test', async () => {
		const nl = nexline({
			input: fs.createReadStream(path.resolve(__dirname, './data/brokenBuffer.txt'), { highWaterMark: 128 }),
		});

		while (true) {
			const line = await nl.next();
			if (line === null) break;
			assert.strictEqual(line.length, 70);
		}
	});

	it('Encoding test', async () => {
		const nl = nexline({
			input: fs.createReadStream(path.resolve(__dirname, './data/cp949.txt')),
			encoding: 'cp949',
		});

		assert.strictEqual('가나다라', await nl.next());
		assert.strictEqual('마바사아', await nl.next());
		assert.strictEqual('자차카아', await nl.next());
		assert.strictEqual(null, await nl.next());
	});

	it('Other separator test', async () => {
		const nl = nexline({
			input: '123;456;789;',
			lineSeparator: ';',
		});

		assert.strictEqual('123', await nl.next());
		assert.strictEqual('456', await nl.next());
		assert.strictEqual('789', await nl.next());
		assert.strictEqual('', await nl.next());
		assert.strictEqual(null, await nl.next());
	});

	it('Multiple separator test', async () => {
		const nl = nexline({
			input: '123;456\r\n789\n000;',
			lineSeparator: [';', '\n', '\r\n'],
		});

		assert.strictEqual('123', await nl.next());
		assert.strictEqual('456', await nl.next());
		assert.strictEqual('789', await nl.next());
		assert.strictEqual('000', await nl.next());
		assert.strictEqual('', await nl.next());
		assert.strictEqual(null, await nl.next());
	});

	it('Empty file test', async () => {
		const nl = nexline({
			input: fs.createReadStream(path.resolve(__dirname, './data/empty.txt')),
		});

		assert.strictEqual('', await nl.next());
		assert.strictEqual(null, await nl.next());
	});

	it('Empty line test', async () => {
		const nl = nexline({
			input: '\n\n\n\n\n\n',
		});

		assert.strictEqual('', await nl.next());
		assert.strictEqual('', await nl.next());
		assert.strictEqual('', await nl.next());
		assert.strictEqual('', await nl.next());
		assert.strictEqual('', await nl.next());
		assert.strictEqual('', await nl.next());
		assert.strictEqual('', await nl.next());
		assert.strictEqual(null, await nl.next());
	});

	it('Invalid parameter test', async () => {
		assert.throws(() => {
			nexline();
		});

		assert.throws(() => {
			nexline({
				input: undefined,
			});
		});

		assert.throws(() => {
			nexline({
				input: '123',
				lineSeparator: true,
			});
		});

		assert.throws(() => {
			nexline({
				input: '123',
				encoding: 'notSupportedEncoding',
			});
		});
	});
});
