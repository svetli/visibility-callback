/* global window */
'use-strict';

let callbackRegister = [];
let tickFlag = false;

const getParentElement = element => {
	return element.parentElement || null;
};

const setCallbackData = cb => {
	const element = cb.element;
	const parentElement = getParentElement(element);
	const clientRect = element.getBoundingClientRect();

	let top = 0;
	if (parentElement) {
		top = parentElement.getBoundingClientRect().top;
	}

	return Object.assign({}, cb, {
		top: clientRect.top + window.pageYOffset - (window.pageYOffset + top),
		height: element.clientHeight
	});
};

const check = (options, offset, innerHeight) => {
	const top = options.top;
	const threshold = options.threshold;
	const height = options.height;

	return height !== 0 && (
		threshold > 1 ?
			offset + innerHeight > top + threshold :
			offset + innerHeight > top + (height * threshold)
	);
};

const runCallback = (options, offset, innerHeight) => {
	const status = check(options, offset, innerHeight);

	if (status) {
		options.callback();
	}

	return !status;
};

const mapCallbackData = () => {
	callbackRegister = callbackRegister.map(cb => {
		return setCallbackData(cb);
	});
};

const checkScroll = () => {
	const offset = window.pageYOffset;
	const height = window.innerHeight;

	const callbacks = callbackRegister.filter(cb => {
		return !runCallback(cb, offset, height);
	});

	callbackRegister = callbackRegister.filter(cb => {
		return !callbacks.some(bc => {
			return cb === bc;
		});
	});
};

const onScroll = () => {
	if (!tickFlag) {
		window.requestAnimationFrame(() => {
			checkScroll();
			tickFlag = false;
		});
	}
	tickFlag = true;
};

const addVisibleCallback = (options, callback) => {
	const element = options.element;
	const threshold = options.threshold || 0.5;

	const callbackData = setCallbackData({
		element: element,
		callback: callback,
		threshold: threshold
	});

	const addToRegister = runCallback(callbackData, window.pageYOffset, window.innerHeight);

	if (addToRegister) {
		callbackRegister.push(callbackData);
	}
};

const removeVisibleCallback = callback => {
	callbackRegister.filter(cb => {
		return cb.callback !== callback;
	});
};

const watchVisible = () => {
	mapCallbackData();
	window.addEventListener('scroll', onScroll);
	onScroll();
};

module.exports = {
	addVisibleCallback,
	removeVisibleCallback,
	watchVisible
};
