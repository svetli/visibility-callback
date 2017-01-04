# visibility-callback

> Run callback when user scroll to specific element

## Install

```
$ npm install --save visibility-callback
```

## Usage
```js
const callback = () => {
	// doSomething
};

addVisibilityCallback({
	element: domElement,
	callback: callback,
	throttle: 0.5
}
```
