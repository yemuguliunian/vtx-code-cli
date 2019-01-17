/**
 * 一个简单的缓存
 */
class Cache {

	constructor() { 
		this.storage = window.localStorage;
	}

	getItem(key) {
		const value = this.storage.getItem(key);
		if(value) {
			return value;
		}
	}

	setItem(key, value) {
		this.storage.setItem(key, value);
	}

	removeItem(key) {
		this.storage.removeItem(key);
	}

	clear() {
		this.storage.clear();
	}
}

const cache = new Cache();
export default cache;