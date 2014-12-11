pm.def('emitter', function(){
  function Emitter(){
    this.events = {};
  }


  /**
   * todo: 是否要支持一次绑定多个 handler ? 
   */
  Emitter.prototype.on = 
  Emitter.prototype.addEventListener = function(type, hanlder){
    if( typeof type != "string" || typeof hanlder != "function"){ return; }
    if( !this.events[type] ){
      this.events[type] = [];
    }
    this.events[type].push(hanlder);
    return this
  };

  Emitter.prototype.emit = 
  Emitter.prototype.trigger = function(type){
    if( typeof type != "string" ){ return; }
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
    if( typeof type != "string" || typeof fn != "function"){ return; }
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


  Emitter.prototype.removeALl = 
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