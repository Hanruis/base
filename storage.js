pm.def('storage', function() {

  /**
  
    TODO:
    - 基本功能策划四
    - 兼容测试
  
  **/
  
  // 参考css88.com 介绍的处理 ie 下的 userdata
  var UserData = {
    userData: null,
    name: location.hostname,

    init: function() {
      if (!UserData.userData) {
        try {
          UserData.userData = document.createElement('INPUT');
          UserData.userData.type = "hidden";
          UserData.userData.style.display = "none";
          UserData.userData.addBehavior("#default#userData");
          document.body.appendChild(UserData.userData);
          var expires = new Date();
          expires.setDate(expires.getDate() + 365);
          UserData.userData.expires = expires.toUTCString();
        } catch (e) {
          return false;
        }
      }
      return true;
    },

    setItem: function(key, value) {
      if (UserData.init()) {
        UserData.userData.load(UserData.name);
        UserData.userData.setAttribute(key, value);
        UserData.userData.save(UserData.name);
      }
    },

    getItem: function(key) {
      if (UserData.init()) {
        UserData.userData.load(UserData.name);
        return UserData.userData.getAttribute(key);
      }
    },

    removeItem: function(key) {
      if (UserData.init()) {
        UserData.userData.load(UserData.name);
        UserData.userData.removeAttribute(key);
        UserData.userData.save(UserData.name);
      }
    }
  };

  if( 'localStorage' in window && window['localStorage'] !== null ){
    module.exports = localStorage;
  }else{
    UserData.init();
    module.exports = UserData;
  }
});