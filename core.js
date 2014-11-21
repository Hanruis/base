
if( typeof SMF == 'undefined' || !SMF ){
  var SMF = {};
}


/**
 * namespace : 处理命名空间的函数。显式调用的方法。避免随意访问SMF,导致方法被覆盖。
 * prop: {string} 要增加的属性.
 * 
 * 暂时仅对SMF “一级”属性进行检查。即SMF.namespace('prop') 是可以的。SMF.namespace('prop.abc') 是不可以的。
 */
SMF.namespace = function(prop){
  var propArray = prop.split('.');
  var len = prop.length;
  var o = SMF;
  var key;
  var flag = false; // 标记，表示是否有重复属性。 默认 false ，没有
  for (var i = 0; i < propArray.length; i++) {
    for(key in o){
      if( key == propArray[i] ){
        if( i == propArray.length - 1 ){
          console.error('SMF.'+prop+' has exist. Please change your prop name.');
          return;
        }else{
          o = o[propArray[i]];
          flag = true;
          break;
        }
      }
    }
    if( !flag ){
      // if not the prop not exist, create new one
      o = o[propArray[i]] = {};
    }
    // reset the flag & next round
    flag = false;
  }
  return o;
};

// test case
// SMF.namespace('app.getTime');
// SMF.namespace('app.setTime');



/**
 * SMF.core 核心 UI 组件;
 */
SMF.namespace('core');


/**
 * Modal ： 弹窗的基础插件。构造器，返回一个 Modal 对象。
 *
 *  Modal 对象的属性：
 *   -- settings: 对象的配置。（配置为默认配置和传入配置的结合）
 *   -- all： 数组。包含“背景”和“窗口”的 zepto 对象
 *   -- close: 关闭弹窗的方法。无参数。注意，该方法只是对元素进行隐藏，并没有将其从DOM树中移除。
 *   -- open[msg] : 打开弹窗。参数 msg 为需要显示的信息。
 *
 *  options {object} : 配置项。
 *   -- callback 是在弹窗打开之后执行的。参数为：弹窗的窗口对象（zepto 对象，不包括背景）
 *   -- klass : 给弹窗的 class 。可是用这个 class 来自定义弹窗的外观。
 * 
 */
SMF.core.Modal = function(options){
  var defaults = {
    hd:'',
    bd:'',
    ft:'',
    top:'',
    left:'',
    callback:null,
    klass:''
  };
  var sets = this.settings = $.extend(true, {}, defaults, options);
  var overlayer = '<div class="overlayer"></div>';
  var panel  = '<div class="modal-box '+sets.klass +'"><div class="modal-hd">'+ sets.hd +'</div>'
           +'<div class="modal-bd">'+ sets.bd +'</div>'
           +'<div class="modal-ft">'+ sets.ft +'</div></div>';

  var $overlayer;
  // 检测是否已经存在遮罩。若有，则不向 body 添加。共用即可。
  if( !$overlayer ){
    $overlayer = this.overlayer = $(overlayer).appendTo('body');
  }else{
    this.overlayer = $overlayer;
  }
  this.panel = $(panel).appendTo('body');

  var Modal = SMF.core.Modal;
  Modal.prototype.setCenter = function(){
    var sets = this.settings
    var $box = this.panel;
    var width = $box.width();
    var height = $box.height();
    var winWithd = $(window).width();
    var winHeight = $(window).height();
    $box.css({
      left: sets.left || (winWithd - width)/2,
      top: sets.top || (winHeight - height)*0.4
    });
  };
  Modal.prototype.close = function(){
    this.overlayer.hide();
    this.panel.hide();
  };
  Modal.prototype.open = function(msg){
    var sets = this.settings;
    this.overlayer.show();
    this.panel.show();
    this.setCenter();  // 优化？
    sets.callback && sets.callback(this.panel);
  };
  Modal.prototype.setTitle = function(text){
    this.panel.find('.modal-hd h3').html(text || '');
  };
  Modal.prototype.setContent = function(conetent){
    this.panel.find('.modal-bd').html(conetent || '');
  };
  Modal.prototype.setFooter = function(content) {
    this.panel.find('.modal-ft').html(content);
  };
  Modal.prototype.waite = function(){
    this.panel.find('.modal-bd').html('<img src="images/loading.gif" alt="" />');
  };
};


/**
 * alert : Modal 的扩展。工厂函数。 返回 modal 对象
 *   option {object}:
 *     -- title: 弹窗的标题
 *     -- msg : 弹窗的信息
 *     -- btnText : 确认按钮的文本
 *     -- callback: 和 modal 同
 *     -- klass: 自定义 class 。注：默认有'M-alertBox'这个class
 *   方法/属性：
 *     -- open(msg, title): title 可选。每次打开都能填入不同的信息。
 *     -- 其他与 modal 同。
 */
FCM.core.alert = function(options){
  var defaults = {
    title:'',
    msg: '',
    btnText: '确认',
    callback: null,
    klass :''
  };

  var sets = $.extend(true, {}, defaults, options);
  var alertBox = new FCM.core.modal({
    hd:'<h3>'+ sets.title +'</h3>',
    bd:'<p>'+ sets.msg +'</p>',
    ft:'<input type="button" value="'+ sets.btnText +'" />',
    callback: sets.callback,
    klass: 'M-alertBox '+sets.klass
  });

  // 由于alert 在验证的表单的时候，会有很多的提示。
  // 先 modifyContent , 再 open 的话，会点的非常的重复。
  // 所以这里就直接覆盖原型中的 open 方法。方便使用。
  alertBox.open = function(msg){
    alertBox.all.show();
    if( msg ){
      alertBox.panel.find('p').text(msg);
    }
    alertBox.setCenter();
  };

  alertBox.panel.find('.modal-ft input').bind('click', function(event){
    alertBox.close();
  });
  return alertBox;
};

/**
 * loading：略;
 */
FCM.core.loading = function(klass){
  klass = klass || '';
  var loadingBox = new FCM.core.modal({
    bd:'<img src="images/loading.gif" alt="" />',
    klass :'M-loadingBox '+klass
  });
  return loadingBox;
};


/**
 * confirm: 
 *   FCM.core.confirm(function(){})
 *   FCM.core.confirm(klass)
 *   FCM.core.confirm(klass, function(){})
 * 注：confirm 的回调，是在点击确认之后才执行的。而非打开的时候执行。这和上面的几个弹窗有写不一样。
 */
FCM.core.confirm = function(){
  // var text = '' ;
  var klass;
  var callback;
  // 重载
  var args = arguments;
  if( args.length === 1){
    switch(typeof args[0]){
      case 'function':
        callback = args[0]; break;
      case 'string':
        klass = agrs[0]; break;
      default:break;
    }
  }else if(args.length === 2){
    klass = args[0];
    callback = args[1];
  }

  var confirmBox = new FCM.core.modal({
    bd:'<h3></h3>',
    klass: 'M-confirmBox '+ klass,
    ft:'<input type="button" class="confirm" value="确定" /><input type="button" class="cancel" value="取消" />'
  });

  confirmBox.setContent = function(msg){
    confirmBox.panel.find('.modal-bd h3').text(msg || '');
  };
  confirmBox.panel.find('input.confirm').bind('click', function(event){
    callback && callback(confirmBox.panel);
  });
   confirmBox.panel.find('input.cancel').bind('click', function(event){
    confirmBox.close();
  });

  return confirmBox;
};


/**
 * listPanel : 弹窗方式的列表。
 */
FCM.core.listPanel = function(options){

  var defaults = {
    title:'列表',
    content:'',
    klass:'',
    callback: null
  };

  var sets = $.extend(true, defaults, options);

  var listPanel = new FCM.core.modal({
    hd:'<h3>'+ sets.title +'</h3><span class="icon-close"></span>',
    bd:sets.content,
    klass:'M-listPanel ' + sets.klass,
    callback:sets.callback
  });

  return listPanel;
};

/**
 * FCM.core.customModal : 自定义弹窗
 * 弹窗的主要内容，写在 html 页面内。
 * 支持弹窗动画，需要 css3 支持
 */
FCM.core.customModal = function(opts){
  var defaults = {
    title:'',
    klass:'',
    content:''
  };

  var sets = $.extend(true, {}, defaults, opts);
  var customModal = new FCM.core.modal({
    hd:sets.title,
    klass: sets.klass
  });
  customModal.customContent = $('.'+sets.content);
  customModal.hasInit = false;
  // 初始化，将内容都放到弹窗里面
  customModal.init = function(){
    customModal.setContent(customModal.customContent);
    customModal.customContent.show();
    customModal.hasInit = true;
  };

  customModal.openWithAnimation = function(In){
    customModal.open();
    // customModal.overlayer.addClass('animated fadeIn');
    customModal.panel.addClass('animated '+ In);
    customModal.panel.on('webkitAnimationEnd',function(event){
      // customModal.overlayer.removeClass('animated fadeIn');
      customModal.panel.removeClass('animated '+In);
      customModal.panel.off('webkitAnimationEnd');
    });
  };

  customModal.closeWithAnimation = function(Out){
    // customModal.overlayer.addClass('animated fadeOut');
    customModal.panel.addClass('animated '+ Out);
    customModal.panel.on('webkitAnimationEnd', function(event){
      // customModal.overlayer.removeClass('animated fadeOut');
      customModal.panel.removeClass('animated '+ Out);
      customModal.close();
      customModal.panel.off('webkitAnimationEnd');
    });
  };

  return customModal;
};
