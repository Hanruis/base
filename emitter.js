pm.def('emitter', function(){
  function Emitter(){
    this.events = {};
  }

  Emitter.prototype.on = 
  Emitter.prototype.addEventListener = function(type, hanlder){
    if( !this.events[type] ){
      this.events[type] = [];
    }
    this.events[type].push(hanlder);
  };

  Emitter.prototype.emit = 
  Emitter.prototype.trigger = function(type){
    var hanlders = this.events[type];
    if( !hanlders ){
      return;
    }else{
      var i;
      for (i = 0; i < hanlders.length; i++) {
        hanlders[i].call(this);
      }
    }
  };

  Emitter.prototype.off = 
  Emitter.prototype.removeEventListener = function(type, fn){
    if( !fn ){
      this.events[type] = [];
      return;
    }
    for (var i = 0; i < events[type].length; i++) {
      if( events[type][i] == fn ){
        events[type].slic(i,1);
      }
    }
  };

  Emitter.prototype.removeAllEventListener = function(){
    this.events = {};
  };

  // get handlers list in some type of event
  Emitter.prototype.listeners = function(type){
    return this.events[type] || [];
  };
  // ...
  Emitter.prototype.hasListener = function(type){
    return !!this.listeners(type).length;
  };

  module.exports = Emitter;
});