def('observer', function(){
	function Observer(){
		this.observerList = [];
	}

	Observer.prototype.addObserver = function(obj){
		this.observerList.push(obj);
	};

	Observer.prototype.removeObserver = function(obj){
		for (var i = 0; i < this.observerList.length; i++) {
			if( this.observerList[i] === obj ){
				this.observerList.slice(i,1);
			}
		}
	};

	Observer.prototype.removeAllObserver = function(){
		this.observerList = [];
	};

	Observer.prototype.getAllObservers = function(){
		return this.observerList;
	};

	Observer.prototype.getObserverByIndex = function(index){
		if( index > -1 && index < this.observerList.length ){
			return this.observerList[index];
		}
	};

	Observer.prototype.notify = function(context){
		for (var i = 0; i < this.observerList.length; i++) {
			this.observerList[i].update(context);
		}
	};

	module.exports = observer;
});

