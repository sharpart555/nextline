/**
 * Import
 */
const stream = require('stream');
const commonUtil = require('./util/commonUtil');

/**
 * Variables
 */
const INPUT_STATUS = {
	BEFORE_READY: 0,
	READY: 1,
	END: 2,
};

/**
 * Create nextline
 * @param param
 * @param param.input string or Readable stream
 * @param [param.lineSeparator] if not specified, auto detect crlf and lf
 */
function nextline(param) {
	/**
	 * Verify & sanitize parameter
	 */
	const param2 = {
		lineSeparator: ['\n', '\r\n'],
		...param,
	};

	// Verify input
	const input = param2.input;
	if (!input) throw new Error('Empty input');
	if (typeof input !== 'string' && !(input instanceof stream.Readable)) throw new Error('Invalid input. Input must be string or readable stream');

	// Verify lineSeparator
	const lineSeparatorList = Array.isArray(param2.lineSeparator) ? [...param2.lineSeparator] : [param2.lineSeparator];
	if (lineSeparatorList.length === 0) throw new Error('Invalid lineSeparator');
	for (const item of lineSeparatorList) {
		if (typeof item !== 'string' || item.length === 0) throw new Error('Invalid lineSeparator, lineSeparator must be string and must exceed one character');
	}

	/**
	 * Variables
	 */
	const nextQueue = [];
	const isStream = input instanceof stream.Readable;
	let inputStatus = isStream ? INPUT_STATUS.BEFORE_READY : INPUT_STATUS.READY;
	let isBusy = false;
	let isFinished = false;
	let bufferString = '';

	/**
	 * Get next line
	 */
	async function next() {
		return new Promise((resolve, reject) => {
			nextQueue.push({ resolve, reject });
			if (!isBusy) processNextQueue();
		});
	}

	/**
	 * Process nextQueue
	 */
	async function processNextQueue() {
		// Set isBusy flag
		isBusy = true;

		// Get nextQueue item
		const item = nextQueue.shift();

		// If finished, always return null
		if (isFinished) {
			item.resolve(null);
			return;
		}

		// Prepare stream
		if (isStream && inputStatus === INPUT_STATUS.BEFORE_READY) {
			await prepareStream();
			inputStatus = INPUT_STATUS.READY;
		}

		// If bufferString contains lineSeparator
		if (bufferString !== null) {
			const lineInfo = commonUtil.getLineAndRest(bufferString, lineSeparatorList);
			if (lineInfo.rest !== null) {
				item.resolve(lineInfo.line);
				bufferString = lineInfo.rest;

				// If nextQueue is not empty. continue processing
				if (nextQueue.length) process.nextTick(processQueue);
				else isBusy = false;
				return;
			}
		}

		// Read some data from stream


		item.resolve('');

		// If nextQueue is not empty. continue processing
		if (nextQueue.length) process.nextTick(processNextQueue);
		else isBusy = false;
	}

	/**
	 * Prepare stream ready to read
	 */
	async function prepareStream() {
		return new Promise((resolve) => {
			input.on('readable', () => {
				inputStatus = INPUT_STATUS.READY;
				resolve();
			});
		});
	}

	return {
		next,
	};
}

/**
 * Export
 */
module.exports = nextline;
