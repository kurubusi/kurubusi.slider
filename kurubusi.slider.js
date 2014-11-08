/**
 *
 *
 *@module KURUBUSI
 
 */


function KURUBUSI(){
	var args = Array.prototype.slice.call(arguments),
			callback = args.pop(),
			modules = (args[0] && typeof args[0] === "string") ? args : args[0],
			i;
	if(!(this instanceof KURUBUSI)){
		return new KURUBUSI(modules, callback);
	}
	
	if(!modules || modules == '*'){
		modules = [];
		for(i in KURUBUSI.modules){
			if(KURUBUSI.modules.hasOwnProperty(i)){
				modules.push(i);
			}
		}
	}
	for(i = 0; i < modules.length; i += 1){
		KURUBUSI.modules[modules[i]](this);
	}
	callback(this);
}
KURUBUSI.prototype.info = {
	name: 'KURUBUSI.main',
	version: '1.0.02 beta',
};



KURUBUSI.modules = KURUBUSI.modules || {};

KURUBUSI.modules.func = function(K){
	
	K.switchArea = function(serchclass, serchtag) {
		var par = document,
				reg = new RegExp('(^| +)' + serchclass + '($| +)'),
				nodeList = [];
		
		if (serchtag === undefined) {
			serchtag = '*';
		}
		var el = par.getElementsByTagName(serchtag);
		for (var i = 0; i < el.length; i++) {
			if (reg.test(el[i].className)){
				nodeList.push(el[i]);
			}
		}
		return nodeList;
	};
	
	K.addEventSet = function(elm,listener,fn){
		try { elm.addEventListener(listener,fn,false);}
		catch(e){ elm.attachEvent("on"+listener,fn);};
	};
	
	K.extendDeep = function(parent, child){
		var i,
				toStr = Object.prototype.toString,
				astr = "[object Array]";
		child = child || {};
		for(i in parent){
			if(parent.hasOwnProperty(i)){
				if(typeof parent[i] === "object"){
					child[i] = (toStr.call(parent[i]) === astr) ? [] : {};
					K.extendDeep(parent[i], child[i]);
				}else{
					child[i] = parent[i];
				}
			}
		}
		return child;
	};
	
	K.addEventSet = function(elm,listener,fn){
		try { elm.addEventListener(listener,fn,false);}
		catch(e){ elm.attachEvent("on"+listener,fn);};
	};
	
	K.addReadyFunction = function(func){
		if(document.addEventListener){
			document.addEventListener("DOMContentLoaded" , func , false) ;
		}else if(window.ActiveXObject){
			var ScrollCheck = function(){
				try {
					document.documentElement.doScroll("left");
				} catch(e) {
					setTimeout(ScrollCheck , 1 );
					return;
				} 
				// and execute any waiting functions
				func();
			}
			ScrollCheck();
		}
	}
	
	
	K.uniqueId = function(){
		var randam = Math.floor(Math.random()*1000)
		var date = new Date();
		var time = date.getTime();
		return randam + time.toString();
	}
	
	
	K.inferenceUa = function(){
		var UA = navigator.userAgent;
		if(UA.indexOf('iPhone') !== -1){
			return 'iPhone';
		}else if(UA.indexOf('iPad') !== -1){
			return 'iPad';
		}else if((UA.indexOf('Android') !== -1) && (UA.indexOf('Mobile') !== -1)){
			return 'AndroidMobile';
		}else if(UA.indexOf('Windows Phone') !== -1){
			return 'Windows Phone';
		}else if(UA.indexOf('BlackBerry') !== -1){
			return 'BlackBerry';
		}else{
			return 'PC';
		}
	};
	
	K.isArray = function(o){
		return Object.prototype.toString.call(o) === '[object Array]';
	}
	
	//t:current time b:startcoordinates c:Distance d:necessary time
	K.easing = function(t,b,c,d){
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	};
	
	K.easeOutQuad = function (t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	}
	
	
	
};














//*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*
//  kurubusi.slider Ver.1.0.02 publicbeta
//  2014-10-24
//  KURUBUSI.net === Masahiro Ohkubo
//  http://kurubusi.net/
//  kurubusi.slider.js
//*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*
/**
 *
 *kurubusi.slider
 *@module
 *@namespace app
 *
 */
KURUBUSI.modules.app = function(K){


	 K.SLIDER = function(obj){
		
		
		
		var Slider = function(){
			var this_ = this,
					args = Array.prototype.slice.call(arguments);
			
			this.w = (args[0].parlent && typeof args[0].parlent === "string") ? document.getElementById(args[0].parlent) : args[0].parlent;
			this.c = (args[0].target && typeof args[0].target === "string") ? document.getElementById(args[0].target) : args[0].target;
			this.speedrate = args[0].speedrate || 150;
			this.durationrateY = args[0].durationrateY || 5;
			this.durationrateX = args[0].durationrateX || 5;
			this.direction = args[0].direction || 'y';
			
			this.w.style.overflow = 'hidden';
			this.c.style.position = 'absolute';
			//this.w.style.position = 'relative';
			
			this.overdiv = document.createElement('div');
			this.overdiv.style.width = '100%';//(parseFloat(document.defaultView.getComputedStyle(this.c, '')['width'])) + 'px';
			this.overdiv.style.height = (parseFloat(document.defaultView.getComputedStyle(this.c, '')['height'])) + 'px';
			this.overdiv.style.position = 'absolute';
			//this.overdiv.style.opacity = '0.5';
			//this.overdiv.style.backgroundColor = 'red';
			this.overdiv.style.top = '0';
			this.overdiv.style.display = 'block';
			//this.overdiv.style.pointerEvents = 'auto';
			this.overdiv.style.left = '0';
			this.c.appendChild(this.overdiv);
			

			
			
			
			var flag = false;
			var pointx;
			var pointy;
			var flag = false;
			var pointobj;
			
			
			
			K.addEventSet(this.overdiv, "mousedown", function(event) {
				flag = true;
				
				pointy = event.clientY + document.documentElement.scrollTop;
				pointx = event.clientX + document.documentElement.scrollLeft;
				
				this_.overdiv.style.display = 'none';
				pointobj = document.elementFromPoint(pointx, pointy);
				this_.overdiv.style.display = 'block';
				
				//
			});
			K.addEventSet(this.overdiv, "mousemove", function(event) {
				if (!flag) return;
				//リンクの場合マウスカーソルを変更する処理が合ったほうがいいが保留
			});
			
			
			K.addEventSet(this.overdiv, "mouseup", function(event) {
				if (!flag) return;
				
				if(pointy === (event.clientY + document.documentElement.scrollTop) && pointx === (event.clientX + document.documentElement.scrollLeft)){
					if(pointobj.fireEvent){
						pointobj.fireEvent( "click" );
					}else{
						
						
						
						//iframeの動画クリック出来ない
						//formの時
						if(pointobj.tagName === 'INPUT' || pointobj.tagName === 'SELECT'){ 
							console.dir(pointobj);
							
							if(pointobj.type === 'submit' || pointobj.type === 'button' ){
								var evt = document.createEvent( "MouseEvents" );
								evt.initEvent( "click", false, true );
								pointobj.dispatchEvent( evt );
							}else{
								//一時的にoverdiv解除　
								this_.overdiv.style.display = 'none';
								
								var evt = document.createEvent( "MouseEvents" );
								if(pointobj.tagName === 'SELECT'){
									evt.initEvent( "mousedown", false, true );
								}else{
									evt.initEvent( "click", false, true );
									pointobj.focus();
								}
								pointobj.dispatchEvent( evt );
								this_.overdiv.style.display = 'block';
								
							}
						}else{
							(function(obj){  //imageの時等
								if(obj.parentElement.tagName === 'BODY'){
									return;
								}else if(obj.parentElement.tagName !== 'A'){
									arguments.callee(obj.parentElement);
								}else{
									pointobj = obj.parentElement;
									return;
								}
							}(pointobj));
						}
						
						if(pointobj.tagName === 'A'){
							var evt = document.createEvent( "MouseEvents" );
							evt.initEvent( "click", false, true );
							pointobj.dispatchEvent( evt );
						}
						
						
						
					}
					
				}
			});
			
			
			var objstyleheight = this.objtComputedStyle(this.c, 'height'),
					objstylewidth = this.objtComputedStyle(this.c, 'width'),
					wheight = this.objtComputedStyle(this.w, 'height'),
					wwidth = this.objtComputedStyle(this.w, 'width');
			
			if(this.direction === 'y' && objstyleheight < window.document.documentElement.clientHeight){  
				this.c.style.height = document.documentElement.clientHeight + 'px';
			}
			this.managedMB(this.c);
			this.managedPCdrag(this.c);
			this.managedPCwheel(this.c);
			
			
			
			
			
			
		};
		
		
		//PC Wheel
		Slider.prototype.managedPCwheel = function(target){
			var this_ = this,
					begin,
					touchStartX,
					touchStartY,
					touchMoveX,
					touchMoveY,
					moveingObj = [],
					mousewheelevent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
			try{
				K.addEventSet(target, mousewheelevent, function(event){
					onWheel(event);
				});
			}catch(e){
				K.addEventSet(target, mousewheel, function(event){
					onWheel(event);
				});
			}
			var onWheel = function(event){
				if(!event) event = window.event; //for legacy IE
				var delta = event.deltaY ? -(event.deltaY) : event.wheelDelta ? event.wheelDelta : -(event.detail),
						objstylewidth = (this_.objtComputedStyle(target, 'width') || 0),
						objstyleheight = (this_.objtComputedStyle(target, 'height') || 0);
						objstyletop = (this_.objtComputedStyle(target, 'top') || 0),
						objstyleleft = (this_.objtComputedStyle(target, 'left') || 0),
						parlentoffsetY = 0,
						parlentoffsetX = 0;
						
				this_.stopEvent(event);
				begin = (new Date()).getTime();
				
				(function(p, y){
					if(p.offsetParent.nodeName !== 'BODY'){
						y += p.offsetTop;
						arguments.callee(p.offsetParent, y);
					}else{
						y += p.offsetTop;
						parlentoffsetY = y;
						return;
					}
				}(target, parlentoffsetY));
				
				moveingObj.push({
					'target': target,
					'touchMoveY': parlentoffsetY + delta,
					'touchStartY': parlentoffsetY,
					'touchMoveX': objstyleleft,
					'touchStartX': objstyleleft,
					'touchLayerX': 0,
					'touchLayerY': 0,
					'd_time': (((new Date()).getTime()) - begin)
				});
				this_.touchingMove(moveingObj);
				
			};
		};
		
		
		//PC Drag and drop
		Slider.prototype.managedPCdrag = function(target){
			var this_ = this,
					begin,
					touchStartX,
					touchStartY,
					touchMoveX,
					touchMoveY,
					flag = false,
					moveingObj = [];
			
			
			target.addEventListener("click",function(event) {
			},false);
			
			
			//mousedown
			K.addEventSet(target, "mousedown", function(event) {
				var parlentoffsetY = 0,
						parlentoffsetX = 0;
				
				//this_.stopEvent(event);
				begin = (new Date()).getTime();
				
				(function(p, y){
					if(p.offsetParent.nodeName !== 'BODY'){
						y += p.offsetTop;
						arguments.callee(p.offsetParent, y);
					}else{
						y += p.offsetTop;
						parlentoffsetY = y;
						return;
					}
				}(target, parlentoffsetY));
				(function(p, x){
					if(p.offsetParent.nodeName !== 'BODY'){
						x += p.offsetLeft;
						arguments.callee(p.offsetParent, x);
					}else{
						x += p.offsetLeft;
						parlentoffsetX = x;
						return;
					}
				}(target, parlentoffsetX));
				
				touchStartX = event.pageX || (event.clientX + document.documentElement.scrollLeft);
				touchStartY = event.pageY || (event.clientY + document.documentElement.scrollTop);
				touchLayerX = event.pageX - parlentoffsetX;
				touchLayerY = event.pageY - parlentoffsetY;
				
				flag = true;
			});
			
			//mousemove
			K.addEventSet(target, "mousemove", function(event) {
				if (!flag) return;
				this_.stopEvent(event);
				
				moveingObj.push({
					'target': target,
					'touchMoveY': event.pageY,
					'touchStartY': touchStartY,
					'touchMoveX': event.pageX,
					'touchStartX': touchStartX,
					'touchLayerX': touchLayerX,
					'touchLayerY': touchLayerY,
					'd_time': (((new Date()).getTime()) - begin)
				});
				
				if(moveingObj[0]){
					this_.touchingMove(moveingObj);
				}
			});
			
			//mouseout
			K.addEventSet(target, "mouseout", function(event) {
				flag = false;
				if(moveingObj[0]){
					this_.touchdMove(moveingObj);
					moveingObj.length = 0;
				}
			});
			
			//mouseup
			K.addEventSet(target, "mouseup", function(event) {
				flag = false;
				if(moveingObj[0]){
					this_.touchdMove(moveingObj);
					moveingObj.length = 0;
				}
			});
			
			
			
		};
		
		
		//MB
		Slider.prototype.managedMB = function(target){
			var this_ = this,
					begin,
					touchStartX,
					touchStartY,
					touchMoveX,
					touchMoveY,
					flag = false,
					moveingObj = [];
					
			//touchstart
			K.addEventSet(target, "touchstart", function(event) {
				var parlentoffsetY = 0,
						parlentoffsetX = 0;
				//this_.stopEvent(event);
				begin = (new Date()).getTime();
				
				(function(p, y){
					if(p.offsetParent.nodeName !== 'BODY'){
						y += p.offsetTop;
						arguments.callee(p.offsetParent, y);
					}else{
						y += p.offsetTop;
						parlentoffsetY = y;
						return;
					}
				}(target, parlentoffsetY));
				(function(p, x){
					if(p.offsetParent.nodeName !== 'BODY'){
						x += p.offsetLeft;
						arguments.callee(p.offsetParent, x);
					}else{
						x += p.offsetLeft;
						parlentoffsetX = x;
						return;
					}
				}(target, parlentoffsetX));
				
				touchStartX = event.touches[0].pageX;
				touchStartY = event.touches[0].pageY;
				touchLayerX = event.touches[0].pageX - parlentoffsetX;
				touchLayerY = event.touches[0].pageY - parlentoffsetY;
				
				//console.log(event.pageY - parlentoffsetY);  //208 mb
				
				flag = true;
			});
			
			//touchmove
			K.addEventSet(target, "touchmove", function(event) {
				if (!flag) return;
				this_.stopEvent(event);
				moveingObj.push({
					'target': target,
					'touchMoveY': event.changedTouches[0].pageY,
					'touchStartY': touchStartY,
					'touchMoveX': event.changedTouches[0].pageX,
					'touchStartX': touchStartX,
					'touchLayerX': touchLayerX,
					'touchLayerY': touchLayerY,
					'd_time': (((new Date()).getTime()) - begin)
				});
				
				if(moveingObj[0]){
					this_.touchingMove(moveingObj);
				}
			});
			
			//touchcancel
			K.addEventSet(target, "touchcancel", function(event) {
				flag = false;
				if(moveingObj[0]){
					this_.touchdMove(moveingObj);
					moveingObj.length = 0;
				}
			});
			
			//touchend
			K.addEventSet(target, "touchend", function(event) {
				flag = false;
				if(moveingObj[0]){
					this_.touchdMove(moveingObj);
					moveingObj.length = 0;
				}
			});
			
		};
		
		
		//repeatedly mouse
		Slider.prototype.touchingMove = function(moveobj){
			var this_ = this,
					lastobj = moveobj[moveobj.length-1],
					objstyletop = (this.objtComputedStyle(lastobj.target, 'top') || 0),
					objstyleleft = (this.objtComputedStyle(lastobj.target, 'left') || 0),
					objstylebottom = (this.objtComputedStyle(lastobj.target, 'bottom') || 0),
					objstyleright = (this.objtComputedStyle(lastobj.target, 'right') || 0),
					objstylewidth = (this.objtComputedStyle(lastobj.target, 'width') || 0),
					objstyleheight = (this.objtComputedStyle(lastobj.target, 'height') || 0),
					wwidth = this.objtComputedStyle(this.w, 'width'),
					wheight = this.objtComputedStyle(this.w, 'height'),
					wtop = this.objtComputedStyle(this.w, 'top'),
					wleft = this.objtComputedStyle(this.w, 'left'),
					moveY,
					moveX,
					parlentoffsetY = 0,
					parlentoffsetX = 0;
			
			
			(function(p, y){
				if(p.offsetParent.nodeName !== 'BODY'){
					y += p.offsetTop;
					arguments.callee(p.offsetParent, y);
				}else{
					y += p.offsetTop;
					parlentoffsetY = y;
					return;
				}
			}(this.w, parlentoffsetY));
			
			(function(p, x){
				if(p.offsetParent.nodeName !== 'BODY'){
					x += p.offsetLeft;
					arguments.callee(p.offsetParent, x);
				}else{
					x += p.offsetLeft;
					parlentoffsetX = x;
					return;
				}
			}(this.w, parlentoffsetX));
			
			moveY = (lastobj.touchMoveY - parlentoffsetY) - lastobj.touchLayerY;
			moveX = (lastobj.touchMoveX - parlentoffsetX) - lastobj.touchLayerX;
			
			if(this.direction === 'x'){
				if(wwidth - (parseFloat(document.defaultView.getComputedStyle(lastobj.target, '')['width'])) > moveX){
					moveX = wwidth - (parseFloat(document.defaultView.getComputedStyle(lastobj.target, '')['width']));
				}else if(moveX > 0){
					moveX = 0;
				}
				lastobj.target.style.left = moveX + 'px';
			}else{
				if(wheight - (parseFloat(document.defaultView.getComputedStyle(lastobj.target, '')['height'])) > moveY){
					moveY = wheight - (parseFloat(document.defaultView.getComputedStyle(lastobj.target, '')['height']));
				}else if(moveY > 0){
					moveY = 0;
				}
				lastobj.target.style.top  = moveY + 'px';
			}
			
			
			
			
			
			
			
			
			
			
		};
		
		//After having separated it
		Slider.prototype.touchdMove = function(moveobj){
			var this_ = this,
					lastobj = moveobj[moveobj.length-1],
					moveobjlength = moveobj.length,
					objstyletop = (this.objtComputedStyle(lastobj.target, 'top') || 0),
					objstyleleft = (this.objtComputedStyle(lastobj.target, 'left') || 0),
					objstylewidth = (this.objtComputedStyle(lastobj.target, 'width') || 0),
					objstyleheight = (this.objtComputedStyle(lastobj.target, 'height') || 0),
					wwidth = this.objtComputedStyle(this.w, 'width'),
					wheight = this.objtComputedStyle(this.w, 'height'),
					begin = new Date(),
					x,
					moveX,
					y,
					moveY,
					duration,
					dr,
					toX,
					toY,
					speed,
					recently = [];
			
			
			for(var i = 1; i <= 10; i++){ //マウスを離す直前の10のイベントで判断
				if(moveobj[moveobjlength - i]){
					recently.unshift(moveobj[moveobjlength - i]);
				}
			}
			
			dr = Math.sqrt(Math.pow((recently[recently.length-1].touchMoveX - recently[0].touchMoveX),2) + Math.pow((recently[recently.length-1].touchMoveY - recently[0].touchMoveY),2));  //移動距離
			
			speed = dr / (recently[recently.length-1].d_time - recently[0].d_time);
			duration = speed * this.speedrate;  //////////////////移動にかかる時間
			
			moveX = (recently[recently.length-1].touchMoveX - recently[0].touchMoveX) * this.durationrateX;//移動する距離
			moveY = (recently[recently.length-1].touchMoveY - recently[0].touchMoveY) * this.durationrateY;//移動する距離
			
			
			toX = objstyleleft + moveX; //目的地
			toY = objstyletop + moveY;
			
			
			if(duration && duration > 100){  //イージング処理
				var timer = setInterval(function(){
					var time = new Date() - begin,
							cuY = K.easeOutQuad(time, objstyletop, moveY, duration),
							cuX = K.easeOutQuad(time, objstyleleft, moveX, duration);
					if (time > duration){
						clearInterval(timer);
						cuX = toX;
						cuY = toY;
					}
					if(this_.moveflg){
						clearInterval(timer);
					}
					if(this_.direction === 'x'){
						if(wwidth - (parseFloat(document.defaultView.getComputedStyle(lastobj.target, '')['width'])) > cuX){
							cuX = wwidth - (parseFloat(document.defaultView.getComputedStyle(lastobj.target, '')['width']));
							clearInterval(timer);
						}else if(cuX > 0){
							cuX = 0;
							clearInterval(timer);
						}
						lastobj.target.style.left = cuX + 'px';
					}else{
						if(wheight - (parseFloat(document.defaultView.getComputedStyle(lastobj.target, '')['height'])) > cuY){
							cuY = wheight - (parseFloat(document.defaultView.getComputedStyle(lastobj.target, '')['height']));
							clearInterval(timer);
						}else if(cuY > 0){
							cuY = 0;
							clearInterval(timer);
						}
						lastobj.target.style.top = cuY + 'px';
					}
					
					
					
				},10);
			}
			
		};
		
		
		//preventDefault
		Slider.prototype.stopEvent = function(event){
			if (event.preventDefault) {
				event.preventDefault();
			}
			event.returnValue = false;
		};
		
		//インラインで指定していないCSSプロパティ取得
		Slider.prototype.objtComputedStyle = function(obj, properties){
			return parseFloat((obj.currentStyle || document.defaultView.getComputedStyle(obj, ''))[properties]);
		};
		
		
		
		
		
		
		new Slider(obj);
	}; //-- SLIDER --//
	
	
}; //-- KURUBUSI --//



KURUBUSI(function(K){
	K.addReadyFunction(function(){
		
		K.SLIDER({
			target: 'c',
			parlent: 'w',
			speedrate: 150,
			durationrateY: 5,
			direction: 'y'
		});
		
		
		K.SLIDER({
			target: 'c2',
			parlent: 'w2',
			speedrate: 150,
			durationrateX: 5,
			direction: 'x'
		});
		
		
	});
});





