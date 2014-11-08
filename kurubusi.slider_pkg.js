/**
 *
 *
 *@module KURUBUSI
 
 */



//*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*
//  kurubusi.slider_pkg Ver.1.0.02 publicbeta
//  2014-10-24
//  KURUBUSI.net === Masahiro Ohkubo
//  http://kurubusi.net/
//  kurubusi.slider_pkg.js
//*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*
/**
 *
 *kurubusi.slider
 *@module
 *@namespace app
 *
 */


var KURUBUSISLIDER = function(obj){
	
	
	
	var Slider = function(){
		var this_ = this,
				args = Array.prototype.slice.call(arguments);
		
		this.w = (args[0].parlent && typeof args[0].parlent === "string") ? document.getElementById(args[0].parlent) : args[0].parlent;
		this.c = (args[0].target && typeof args[0].target === "string") ? document.getElementById(args[0].target) : args[0].target;
		this.speedrate = args[0].speedrate || 150;
		this.durationrateY = args[0].durationrateY || 5;
		this.durationrateX = args[0].durationrateX || 5;
		this.direction = args[0].direction || 'y';
		
		
		var objstyleheight = this.objtComputedStyle(this.c, 'height'),
				objstylewidth = this.objtComputedStyle(this.c, 'width'),
				wheight = this.objtComputedStyle(this.w, 'height'),
				wwidth = this.objtComputedStyle(this.w, 'width');
		
		this.w.style.overflow = 'hidden';
		this.c.style.position = 'absolute';
		this.w.style.position = 'relative';
		
		this.overdiv = document.createElement('div');
		this.overdiv.style.width = (parseFloat(document.defaultView.getComputedStyle(this.c, '')['width'])) + 'px';
		this.overdiv.style.height = (parseFloat(document.defaultView.getComputedStyle(this.c, '')['height'])) + 'px';
		this.overdiv.style.position = 'absolute';
		//this.overdiv.style.opacity = '0.5';
		//this.overdiv.style.backgroundColor = 'red';
		this.overdiv.style.top = '0';
		this.overdiv.style.left = '0';
		this.c.appendChild(this.overdiv);
		
		if(this.direction === 'y' && objstyleheight < wheight){
			this.c.style.paddingBottom = (wheight - (parseFloat(document.defaultView.getComputedStyle(this.c, '')['height']))) + 'px';
		}else{
			this.managedMB(this.c);
			this.managedPCdrag(this.c);
			this.managedPCwheel(this.c);
		}
		
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
			addEventSet(target, mousewheelevent, function(event){
				onWheel(event);
			});
		}catch(e){
			addEventSet(target, mousewheel, function(event){
				onWheel(event);
			});
		}
		var onWheel = function(event){
			if(!event) event = window.event; //for legacy IE
			var delta = event.deltaY ? -(event.deltaY) : event.wheelDelta ? event.wheelDelta : -(event.detail),
					objstylewidth = (this_.objtComputedStyle(target, 'width') || 0),
					objstyleheight = (this_.objtComputedStyle(target, 'height') || 0);
					objstyletop = (this_.objtComputedStyle(target, 'top') || 0),
					objstyleleft = (this_.objtComputedStyle(target, 'left') || 0);
			this_.stopEvent(event);
			
			begin = (new Date()).getTime();
			
			moveingObj.push({
				'target': target,
				'touchMoveY': objstyletop + delta,
				'touchStartY': objstyletop,
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
		
		//mousedown
		addEventSet(target, "mousedown", function(event) {
			var parlentoffsetY = 0,
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
			
			this_.stopEvent(event);
			begin = (new Date()).getTime();
			
			
			touchStartX = event.pageX || (event.clientX + document.documentElement.scrollLeft);
			touchStartY = event.pageY || (event.clientY + document.documentElement.scrollTop);
			touchLayerX = event.pageX - parlentoffsetX;
			touchLayerY = event.pageY - parlentoffsetY;
			
			flag = true;
		});
		
		//mousemove
		addEventSet(target, "mousemove", function(event) {
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
			
			this_.touchingMove(moveingObj);
			
		});
		
		//mouseout
		addEventSet(target, "mouseout", function(event) {
			flag = false;
			if(moveingObj[0]){
				this_.touchdMove(moveingObj);
				moveingObj.length = 0;
			}
		});
		
		//mouseup
		addEventSet(target, "mouseup", function(event) {
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
		addEventSet(target, "touchstart", function(event) {
			var parlentoffsetY = 0,
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
			
			flag = true;
		});
		
		//touchmove
		addEventSet(target, "touchmove", function(event) {
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
		addEventSet(target, "touchcancel", function(event) {
			flag = false;
			if(moveingObj[0]){
				this_.touchdMove(moveingObj);
				moveingObj.length = 0;
			}
		});
		
		//touchend
		addEventSet(target, "touchend", function(event) {
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
		
		for(var i = 1; i <= 10; i++){
			if(moveobj[moveobjlength - i]){
				recently.unshift(moveobj[moveobjlength - i]);
			}
		}
		//console.log(recently);
		
		dr = Math.sqrt(Math.pow((recently[recently.length-1].touchMoveX-recently[0].touchMoveX),2) + Math.pow((recently[recently.length-1].touchMoveY-recently[0].touchMoveY),2));
		
		speed = dr / (recently[recently.length-1].d_time - recently[0].d_time);
		duration = speed * this.speedrate;
		
		moveX = (recently[recently.length-1].touchMoveX - recently[0].touchMoveX) * this.durationrateX;
		moveY = (recently[recently.length-1].touchMoveY - recently[0].touchMoveY) * this.durationrateY;
		
		
		toX = objstyleleft + moveX;
		toY = objstyletop + moveY;
		
		if(duration && duration > 100){
			var timer = setInterval(function(){
				var time = new Date() - begin,
						cuY = easeOutQuad(time, objstyletop, moveY, duration),
						cuX = easeOutQuad(time, objstyleleft, moveX, duration);
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
	
	Slider.prototype.objtComputedStyle = function(obj, properties){
		return parseFloat((obj.currentStyle || document.defaultView.getComputedStyle(obj, ''))[properties]);
	};
	
	
	
	
	
	
	
	
	
	
	
	
	
	switchArea = function(serchclass, serchtag) {
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
	
	addEventSet = function(elm,listener,fn){
		try { elm.addEventListener(listener,fn,false);}
		catch(e){ elm.attachEvent("on"+listener,fn);};
	};
	
	extendDeep = function(parent, child){
		var i,
				toStr = Object.prototype.toString,
				astr = "[object Array]";
		child = child || {};
		for(i in parent){
			if(parent.hasOwnProperty(i)){
				if(typeof parent[i] === "object"){
					child[i] = (toStr.call(parent[i]) === astr) ? [] : {};
					extendDeep(parent[i], child[i]);
				}else{
					child[i] = parent[i];
				}
			}
		}
		return child;
	};
	
	addEventSet = function(elm,listener,fn){
		try { elm.addEventListener(listener,fn,false);}
		catch(e){ elm.attachEvent("on"+listener,fn);};
	};
	
	addReadyFunction = function(func){
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
	
	
	uniqueId = function(){
		var randam = Math.floor(Math.random()*1000)
		var date = new Date();
		var time = date.getTime();
		return randam + time.toString();
	}
	
	
	isArray = function(o){
		return Object.prototype.toString.call(o) === '[object Array]';
	}
	
	//t:current time b:startcoordinates c:Distance d:necessary time
	easing = function(t,b,c,d){
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	};
	
	easeOutQuad = function (t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	}
	
	
	
	
	
	
	
	
	
	
	
	
	addReadyFunction(function(){
		new Slider(obj);
	});
	
	
	
	
	
	
}; //-- KURUBUSISLIDER --//







KURUBUSISLIDER({
	target: 'c',
	parlent: 'w',
	speedrate: 150,
	durationrateY: 5,
	durationrateX: 5,
	direction: 'y'
});


KURUBUSISLIDER({
	target: 'c2',
	parlent: 'w2',
	speedrate: 150,
	durationrateY: 5,
	durationrateX: 5,
	direction: 'x'
});









