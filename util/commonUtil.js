/**
 * Sanitize Number
 * @param param
 * @param param.value
 * @param param.default
 * @param [param.min]
 * @param [param.max]
 */
function sanitizeNumber(param) {
	let result = Number(param.value);
	if (Number.isNaN(result)) result = param.default;

	if (param.min !== undefined && result < param.min) result = param.min;
	else if (param.max !== undefined && result > param.max) result = param.max;

	return result;
}

/**
 * Sanitize ENUM
 * @param param
 * @param param.value
 * @param param.list
 * @param [param.default] if not provided, it returns first item in list
 */
function sanitizeEnum(param) {
	const { value, list } = param;
	if (list.indexOf(value) !== -1) return value;
	else if (param.default !== undefined) return param.default;
	else return list[0];
}

/**
 * Get lineSeperator index
 * @param text
 * @param lineSeperatorList
 */
function getLineSeperatorPosition(text, lineSeperatorList) {
	const result = {
		index: -1,
		length: 0,
	};

	// Iterate over lineSeperatorList
	for (const item of lineSeperatorList) {
		const index = text.indexOf(item);
		if (index === -1) continue;

		if (
			result.index === -1 || //
			index < result.index ||
			(index === result.index && item.length > result.length)
		) {
			result.index = index;
			result.length = item.length;
		}
	}

	return result;
}

/**
 * Get one line from string
 * @param text
 * @param lineSeperatorList
 */
function getLineAndRest(text, lineSeperatorList) {
	const position = getLineSeperatorPosition(text, lineSeperatorList);

	if (position.index === -1) {
		// If line seperator not found
		return {
			line: text,
			rest: null,
		};
	} else {
		// If line seperator found
		return {
			line: text.slice(0, position.index),
			rest: text.slice(position.index + position.length),
		};
	}
}

/**
 * Concatenate string with special null treatment
 * @param a
 * @param b
 */
function concat(a, b) {
	if (a === null && b === null) return null;
	if (a === null) a = '';
	if (b === null) b = '';
	return a + b;
}

module.exports = {
	sanitizeNumber,
	sanitizeEnum,
	getLineSeperatorPosition,
	getLineAndRest,
	concat,
};
