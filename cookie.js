pm.def('cookie', function(){
	/**
	
		TODO:
		- 做长度检测
		- key 数量检测
		- 测试。
	
	**/
	
	// 因为作者偷懒的关系
	// 目前仅支持 ECMScript 5..
	var cookie = {};

	cookie.get = function(key){
		if( !key ){return;}

		var jsonCookie = cookie.toJson();
		return jsonCookie[key];
	};

	cookie.getAll = function(){
		return cookie.toJson();
	};

	cookie.set = function(key, value, expiredays){
		var temp = cookie.get(key);
		temp[key] = value;
		if( expiredays ){
			temp[expires] = expiredays;
		}
		console.log(cookie.toString(temp));
		document.cookie = cookie.toString(temp);
		return document.cookie;
	};

	cookie.setMulti = function(o, expiredays){
		var temp = cookie.getAll();
		for(var key in o ){
			temp[key] = o[key];
		}
		if( expiredays ){
			temp[expires] = expiredays;
		}
		document.cookie = cookie.toString(temp);
		return document.cookie;
	};

	cookie.del = function(){
		var o;
		var argsArray = [];
		if( !arguments.length ){return;}
		for (var i = 0; i < arguments.length; i++) {
			o[arguments[i]] = "";
			argsArray.push(arguments[i]);
		}
		cookie.setMulti(o);
		return argsArray;
	};

	cookie.delAll = function(){
		var temp = cookie.get();
		for(var key in temp){
			temp[key] = "";
		}
		cookie.setMulti(temp);
	};

	cookie.toJson = function(){
		var temp = document.cookie;
		var o = {};
		temp = temp.split(';');
		temp.forEach(function(element){
			var keyValue;
			element = String.prototype.trim.call(element);
			keyValue = element.split('=');
			o[keyValue[0]] = keyValue[1];
		});
		return o;
	};

	cookie.toString = function(o){
		var keyValueArray = [];
		for(var key in o){
			keyValueArray.push(key+"="+o[key]);
		}
		return keyValueArray.join(';');
	};

});