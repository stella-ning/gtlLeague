$(function(){
    var imf = function () {
    	var lf = 0;
    	var instances = [];
    	//定义一个通过class获得元素的方法
    	function getElementsByClass (object, tag, className) {
    		var o = object.getElementsByTagName(tag);
    		for ( var i = 0, n = o.length, ret = []; i < n; i++)
    			if (o[i].className == className) ret.push(o[i]);
    		if (ret.length == 1) ret = ret[0];
    		return ret;
    	}
    	function addEvent (o, e, f) {
    		if (window.addEventListener) o.addEventListener(e, f, false);
    		else if (window.attachEvent) r = o.attachEvent('on' + e, f);
    	}
    	/*--- ImageFlow构造器--- */
    	function ImageFlow(oCont, size, zoom, border) {
    		this.diapos     = [];
    		this.scr        = false;
    		this.size       = size;
    		this.zoom       = zoom;
    		this.bdw        = border;
    		this.oCont      = oCont;
    		this.oc         = document.getElementById(oCont);
    		this.scrollbar  = getElementsByClass(this.oc,   'div', 'scrollbar');
    		this.bar        = getElementsByClass(this.oc,   'img', 'bar');
    		this.arL        = getElementsByClass(this.oc,   'img', 'arrow-left');
    		this.arR        = getElementsByClass(this.oc,   'img', 'arrow-right');
            this.imgBtn     = getElementsByClass(this.oc,    'span', 'btnItem');
    		this.bw         = this.bar.width;
    		this.alw        = this.arL.width - 5;
    		this.arw        = this.arR.width - 5;
    		this.bar.parent = this.oc.parent  = this;
    		this.arL.parent = this.arR.parent = this;
    		this.view       = this.back       = -1;
    		this.resize();
    		this.oc.onselectstart = function () { return false; }

    		/* ---- 创建图片 ---- */
    		var img   = getElementsByClass(this.oc, 'div', 'bank').getElementsByTagName('a');
    		this.NF = img.length;//获取图片的长度
            //遍历
    		for (var i = 0, o; o = img[i]; i++) {
    			this.diapos[i] = new Diapo(this, i,
    										o.rel,
    										o.title || '- ' + i + ' -',
    										o.innerHTML || o.rel,
    										o.href || '',
    										o.target || '_self'
    			);
    		}

    		/*-- right arrow 下一张--*/
    		this.arR.onclick = this.arR.ondblclick = function () {
                //判断当前view 是否小于最大长度-1,如果是那view=1
    			if (this.parent.view < this.parent.NF - 1)
    				this.parent.calc(1);
    		}
    		/* -- Left arrow 上一张-- */
    		this.arL.onclick = this.arL.ondblclick = function () {
                //判断当前view 是否大于0,如果是那view=-1
    			if (this.parent.view > 0)
    				this.parent.calc(-1);
    		}
    	}
    	/* ---ImageFlow prototype 构造器的原型---*/
    	ImageFlow.prototype = {
    		/* --targets 目标 -- */
    		calc : function (inc) {
    			if (inc) this.view += inc;
    			var tw = 0;
    			var lw = 0;
    			var o = this.diapos[this.view];
    			if (o && o.loaded) {
    				/* ---- reset重置图片,下划线大小 ---- */
    				var ob = this.diapos[this.back];
    				if (ob && ob != o) {
    					ob.img.className = 'diapo';
                        this.imgBtn[this.view].className = 'btnItem'
    					ob.z1 = 1;
    				}
    				/* ---- update hyperlink 更新大图片,下划线---- */
    				if (o.url) {
    					o.img.className = 'diapo link';
    					window.status = 'hyperlink: ' + o.url;
                        $(this.imgBtn[this.view]).addClass('active').siblings().removeClass('active');
    				} else {
    					o.img.className = 'diapo';
                        this.imgBtn[this.view].className = 'btnItem'
    					window.status = '';
    				}
    				/* ---- calculate target sizes & positions 计算目标图片的大小和位置 ---- */
    				o.w1 = Math.min(o.iw, this.wh * .4) * o.z1;
    				var x0 = o.x1 = (this.wh * .5) - (o.w1 * .5);
    				var x = x0 + o.w1 + this.bdw;
    				for (var i = this.view + 1, o; o = this.diapos[i]; i++) {
    					if (o.loaded) {
    						o.x1 = x;
    						o.w1 = (this.ht / o.r) * this.size;
    						x   += o.w1 + this.bdw;
    						tw  += o.w1 + this.bdw;
    					}
    				}
    				x = x0 - this.bdw;
    				for (var i = this.view - 1, o; o = this.diapos[i]; i--) {
    					if (o.loaded) {
    						o.w1 = (this.ht / o.r) * this.size;
    						o.x1 = x - o.w1;
    						x   -= o.w1 + this.bdw;
    						tw  += o.w1 + this.bdw;
    						lw  += o.w1 + this.bdw;
    					}
    				}

    				/* ---- save preview view 保存前一个view值---- */
    				this.back = this.view;
    			}
    		},

    		/* --resize 浏览器窗口大小改变--*/
    		resize : function () {
    			this.wh = this.oc.clientWidth;
    			this.ht = this.oc.clientHeight;
    			this.ws = this.scrollbar.offsetWidth;
    			this.calc();
    			this.run(true);
    		},
    		/*-- move all images 移动所有图片 --*/
    		run : function (res) {
    			var i = this.NF;
    			while (i--) this.diapos[i].move(res);
    		}
    	}
    	/*--- Diapo Constructor 幻灯片构造器 --- */
    	Diapo = function (parent, N, src, title, text, url, target) {
    		this.parent        = parent;
    		this.loaded        = false;
    		this.title         = title;
    		this.text          = text;
    		this.url           = url;
    		this.target        = target;
    		this.N             = N;
    		this.img           = document.createElement('img');
    		this.img.src       = src;
    		this.img.parent    = this;
    		this.img.className = 'diapo';
    		this.x0            = this.parent.oc.clientWidth;
    		this.x1            = this.x0;
    		this.w0            = 0;
    		this.w1            = 0;
    		this.z1            = 1;
    		this.img.parent    = this;
    		this.img.onclick   = function() { this.parent.click(); }
    		this.parent.oc.appendChild(this.img);
    		/* ---- display external link ---- */
    		if (url) {
    			this.img.onmouseover = function () { this.className = 'diapo link';	}
    			this.img.onmouseout  = function () { this.className = 'diapo'; }
    		}
    	}
    	/* --- Diapo prototype 幻灯片构造器原型 --- */
    	Diapo.prototype = {
    		/* --- HTML rendering html 渲染--- */
    		move : function (res) {
    			if (this.loaded) {
    				var sx = this.x1 - this.x0;
    				var sw = this.w1 - this.w0;
    				if (Math.abs(sx) > 2 || Math.abs(sw) > 2 || res) {
    					/* ---- paint only when moving 当移动的以后描绘图片---- */
    					this.x0 += sx * .1;
    					this.w0 += sw * .1;
    					if (this.x0 < this.parent.wh && this.x0 + this.w0 > 0) {
    						/* ---- paint only visible images 只描绘在可视化区域的图片 ---- */
    						this.visible = true;
    						var o = this.img.style;
    						var h = this.w0 * this.r;
    						/* ---- diapo 幻灯片---- */
    						o.left   = Math.round(this.x0) + 'px';
    						o.bottom = Math.floor(this.parent.ht * .25) + 'px';
    						o.width  = Math.round(this.w0) + 'px';
    						o.height = Math.round(h) + 'px';

    					} else {
    						/* ---- disable invisible images 隐藏不在可视化区域的图片  ---- */
    						if (this.visible) {
    							this.visible = false;
    							this.img.style.width = '0px';
    						}
    					}
    				}
    			} else {
    				/* -- image onload 图片加载 --- */
    				if (this.img.complete && this.img.width) {
    					/* ---- get size image 获取图片大小---- */
    					this.iw     = this.img.width;
    					this.ih     = this.img.height;
    					this.r      = this.ih / this.iw;
    					this.loaded = true;
    					if (this.parent.view < 0) this.parent.view = this.N-2;
    					this.parent.calc();
    				}
    			}
    		},
    		/* ==== diapo onclick 幻灯片点击事件 ==== */
    		click : function () {
    			if (this.parent.view == this.N) {
    				/* ---- click on zoomed diapo 点击图片时---- */
    				if (this.url) {
    					/* ---- open hyperlink 移动到中间显示大图---- */
    					window.open(this.url, this.target);
    				} else {
    					/* ---- zoom in/out 其他的移到---- */
    					this.z1 = this.z1 == 1 ? this.parent.zoom : 1;
    					this.parent.calc();
    				}
    			} else {
    				/* ---- select diapo ---- */
    				this.parent.view = this.N;
    				this.parent.calc();
    			}
    			return false;
    		}
    	}
    	/* //////////// ==== public methods ==== //////////// */
    	return {
    		/* ==== initialize script ==== */
    		create : function (div, size, zoom, border) {
    			/* ---- instanciate imageFlow ---- */
    			var load = function () {
    				var loaded = false;
    				var i = instances.length;
    				while (i--) if (instances[i].oCont == div) loaded = true;
    				if (!loaded) {
    					/* ---- push new imageFlow instance ---- */
    					instances.push(
    						new ImageFlow(div, size, zoom, border)
    					);
    					/* ---- init script (once) ---- */
    					if (!imf.initialized) {
    						imf.initialized = true;
    						/* ---- window resize event ---- */
    						addEvent(window, 'resize', function () {
    							var i = instances.length;
    							while (i--) instances[i].resize();
    						});
    						/* ---- stop drag N drop ---- */
    						addEvent(document.getElementById(div), 'mouseout', function (e) {
    							if (!e) e = window.event;
    							var tg = e.relatedTarget || e.toElement;
    							if (tg && tg.tagName == 'HTML') {
    								var i = instances.length;
    								while (i--) instances[i].oc.onmousemove = null;
    							}
    							return false;
    						});
    						/* ---- set interval loop ---- */
    						setInterval(function () {
    							var i = instances.length;
    							while (i--) instances[i].run();
    						}, 16);
    					}
    				}
    			}
    			/* ---- window onload event ---- */
    			addEvent(window, 'load', function () { load(); });
    		}
    	}
    }();

    /* ==== create imageFlow ==== */
    //          div ID    , size, zoom, border
    imf.create("imageFlow", 0.15, 1.5, 5);


})
