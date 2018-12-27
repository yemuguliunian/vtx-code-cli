/**
 * 定时器：定时清理dist目录下的文件
 * 每天凌晨检查是否有缓存七天的文件
 * 有则清理掉
 */
const _clean = Symbol('clean');

class CleanTemplateJob {

	constructor() { 
		this.interval : 1, // 间隔天数
		this.storageTime : 7 // 保存天数 
	}

	get init() {
		const _t = this;
		let current = new Date();
		let next = new Date();
		next.setDate(current.getDate() + 1);
		next.setHours(0);
		next.setMinutes(0);
		next.setSeconds(0);
		
		setTimeout(_t[_clean], next - current);
	}
	
	[_clean]() {
		const _t = this;
		setTimeout(_t[[_clean]], _t.interval * 24 * 60 * 60 * 1000);
		// do something
	}

}