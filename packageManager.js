
// 先假设文件名和模块名字一样
// 每个文件只定义一个模块
// 

// 模块容器,将加载的模块放到里面
// 全局变量
var	module = {};

// pm : package manager
var pm = {};

/**
 * 加载器
 * path : {string} , 加载文件的路径
 * cb   ：{function}, 加载之后执行的回调函数
 * 2014-12-11 增加对参数类型的判断
 */
pm.load = function(path, cb){
	if( typeof path != "string" || typeof cb != "string" ){return;}
	var moduleName = pm.resolve(path);

	if( pm.hasLoaded(moduleName) ){
		cb(module[moduleName]);
		return;
	}
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.src = path;
	// todo: 这里 ie 不兼容，需要修复
	script.onload = function(){
		cb(module[moduleName]);
	};
	head.appendChild(script);
};

// 定义模块
pm.def = function(name, fn){
	if( typeof name != "name" || typeof fn != "function" ){
		console.error("wrong type of param")
		return;
	}
	var key ;
	if( pm.hasLoaded(name) ){
		console.error('the module :"'+ name +'" has exist!');
	}
	fn();
	module[name] = module.exports;
};


// 检查是否已经加载过了
pm.hasLoaded = function(name){
	var key;
	for(key in module){
		if( key === name ){
			return true;
		}
	}
	return false;
};

// 处理路径获取模块名
pm.resolve = function(path){
	var name = path.substring(path.lastIndexOf('/')+1);
	name = name.substring(0,name.lastIndexOf('.'));
	return name;
};

