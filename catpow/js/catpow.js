(function($){$.fn.extend({
	//activateイベントをキック及びactiveクラスを付与しinactiveクラスを除去するcatpow.js汎用関数
	cp_activate:function(){
		$(this).trigger('activate').addClass('active').removeClass('inactive');
	},
	//inactivateイベントをキック及びactiveクラスを除去しinactiveクラスを付与するcatpow.js汎用関数
	cp_inactivate:function(){
		$(this).trigger('inactivate').removeClass('active').addClass('inactive');
	},
	//updateイベントをキックするcatpow.js汎用関数
	cp_update:function(){
		$(this).trigger('update');
	},
	
	//セレクタに一致する要素が追加された際に
	//追加された要素を引数にcbを実行
	cp_observe:function(sel,cb){
		var o=new MutationObserver(function(mutations){
			mutations.map(function(mutation){
				mutation.addedNodes.forEach(function(node){
					if(node.nodeType===1){
						if($(node).is(sel)){cb($(node));}
						cb($(node.querySelectorAll(sel)));
					}
				});
			});
		});
		$(this).each(function(){
			o.observe(this,{childList:true,subtree:true});
		});
		return o;
	},
    
    
	//親要素内でスクロールフィックス、offset値だけ上にマージンをとる
	cp_scrollfix:function(offset){
		offset=offset?offset:0;
		var $parent=$(this).parent();
		var $control=$(this);
		var $window=$(window);
		var s=$window.scrollTop();
		var ts=0;
		var ty=0;
		var winh;
		if($parent.css('position')==='static'){$parent.css({"position":"relative"});}
		$control.init=function(){
			winh=window.innerHeight;
			$control.each(function(){
				$(this).css({transform:'translate3d(0,0,0)'});
				this.o=this.parentNode.getBoundingClientRect().top-this.getBoundingClientRect().top;
			});
			$control.update();
		}
		$control.update=function(){
			winh=window.innerHeight;
			ts=$window.scrollTop()-s;
			s=$window.scrollTop();
			$control.each(function(){
				var bnd1=this.getBoundingClientRect();
				var bnd2=this.parentNode.getBoundingClientRect();
				if(bnd2.top>offset){
					$(this).css({transform:'translate3d(0,0,0)',position:'absolute',top:0,bottom:'auto'});
				}
				else if(bnd2.top+bnd2.height<offset+bnd1.height){
					$(this).css({transform:'translate3d(0,0,0)',position:'absolute',top:'auto',bottom:0});
				}
				else{
					ty-=ts;
					ty=Math.min(0,Math.max(winh-bnd1.height,ty));
					$(this).css({transform:'translate3d(0,'+ty+'px,0)',position:'fixed',top:offset + 'px',bottom:'auto'});
					
				}
			});
		};
		$(window).scroll(function(){$control.update();});
		$(window).resize(function(){$control.init();});
		$control.init();
		return this;
	},
	//子要素を自身のサイズと表示位置にあわせてスクロールさせる
	cp_parallax:function(){
		var $tgt=$(this);
		$tgt.css({overflow:'hidden'}).children().css({position:'absolute'});
		if($tgt.css('position')==='static'){$tgt.css('position','relative');}
		$tgt.update=function(){
			var winh=window.innerHeight;
			$tgt.each(function(){
				var bnd=this.getBoundingClientRect();
				var tgth=bnd.height;
				if(bnd.top > winh || bnd.top + tgth < 0){return;}
				var p1=bnd.top/(winh-tgth);
				var p2=(bnd.top+tgth)/(winh+tgth);
				$(this).children().each(function(){
					var chlh=this.getBoundingClientRect().height;
					if(tgth > chlh ^ chlh > winh){
						$(this).css({transform:'translate3d(0,'+(tgth-(tgth+chlh)*p2)+'px,0)'})
					}
					else{
						$(this).css({transform:'translate3d(0,'+((tgth-chlh)*p1)+'px,0)'})
					}
				});
			});
		};
		$(window).scroll(function(){$tgt.update();});
		$tgt.update();
		return $tgt;
	},
		
	//要素の内容を一定時間をかけて削除する
	// step1 : 要素に.transition.from.delを付与する
	// step2 : 1ミリ秒後、要素の.fromを除去し.toを付与する
	// step3 : delayミリ秒後、要素をremoveする
	cp_delay_remove:function(delay){
		if(delay===undefined){delay=1000;}
		var dfr=new $.Deferred();
        var $tgt=$(this);
		$tgt.addClass('transition from del');
		setTimeout(function(){$tgt.removeClass('from').addClass('to');},1);
		setTimeout(function(){$tgt.remove();dfr.resolve();},delay);
		return dfr.promise();
	},
	//要素の内容を一定時間をかけて入れ替える
	// step1 : 要素に.transition.fromを付与し現行の内容をdiv.org 新規をdiv.newでwrapする
	// step2 : 1ミリ秒後、要素の.fromを除去し.toを付与する
	// step3 : delayミリ秒後、要素の.transitionを除去、div.orgをremoveしてdiv.newをunwrapする
	//（delayをtransitionendイベントでの実装に置き換えたい）
	cp_delay_replace:function(content,delay){
		if(delay===undefined){delay=1000;}
		var dfr=new $.Deferred();
		var org_size={width:$(this).width()+'px',height:$(this).height()+'px'};
		var $org=$(this).addClass('transition from org');
		var $new=$(this).clone().removeClass('org').addClass('new').html(content).insertAfter($org);
		var $tgt=$org.add($new);
		var new_size={width:$new.width()+'px',height:$new.height()+'px'};
		$org.css(org_size);
		$new.css(org_size);
		setTimeout(function(){$tgt.removeClass('from').addClass('to');$new.css(new_size);},1);
		setTimeout(function(){
			$org.remove();
			$new.removeAttr('style').removeClass('transition to new').trigger('replace');
			dfr.resolve();
		},delay);
		return dfr.promise();
	},
		
	//リンクをajaxでリンク内容をtgtに読み込む形にする、data-ajax-urlがセットされていればその内容をtgtに読み込む
	cp_ajax_link:function($tgt,complete){
		$(this).each(function(){
			var url=$(this).attr('href');
			var data_url=url;
			if($(this).attr('data-ajax-url')!==null){data_url=$(this).attr('data-ajax-url');}
			$(this).click(function(i,e){
				e.preventDefault();
				$.ajax({
					url:data_url,
					success:function(data){
						window.history.pushState(null,null,$(this).attr('href'));
						$tgt.html(data);
						$(document).ready(function() {
							if(complete!==null){complete();}
						});
					}
				});
			});
		});
		return this;
	},
		
	//対象の各子要素にスクロールが到達したら
	//data-srcをsrcにセット
    //data-srcsetをsrcsetにセット
	cp_lazy_load:function(){
		var $lazy=$(this);
		var srcs=[];
        var srcsets=[];
		$lazy.find('[data-src]').each(function(){srcs.push(this);});
		$lazy.find('[data-srcset]').each(function(){srcsets.push(this);});
		$lazy.update=function(){
			var thr=window.innerHeight+100;
			srcs=srcs.filter(function(src){
				if(src.getBoundingClientRect().top < thr){
					src.setAttribute('src',src.getAttribute('data-src'));
					return false;
				}
				return true;
			});
			srcsets=srcsets.filter(function(srcset){
				if(srcset.getBoundingClientRect().top < thr){
					srcset.setAttribute('srcset',srcset.getAttribute('data-srcset'));
					return false;
				}
				return true;
			});
		};
		$(window).on('scroll',$lazy.update);
		$lazy.update();
		return $lazy;
	},
	//対象の各子要素をスクロールが到達するまで非表示
	cp_lazy_render:function(){
		var $lazy=$(this);
		var lazyBox=$lazy.get(0);
		var $tgts=$lazy.children();
		$tgts.hide();
		$lazy.addClass('lazy_render');
		$lazy.update=function(){
			$tgts=$tgts.filter(function(){
				if(lazyBox.getBoundingClientRect().bottom<2000){
					$(this).show();return false;
				}
				return true;
			});
		}
		$tgts.on('expect.lazy_render',function(){
			$(this).show().off('.lazy_render');
			$(this).prevAll().show().off('.lazy_render');
			$tgts=$(this).nextAll();
		});
		$(window).on('scroll',$lazy.update);
		$lazy.update();
		return $lazy;
	},
	//srcsetから要素のサイズに応じたファイルをsrcにセットする
	//コントローラとなるオブジェクトを返す
	//sizes属性に関係なく要素のサイズに基づいて判定する
	cp_loader:function(){
		var $loader,$tgts;
		$loader=$(this);
		if($loader.is('[srcset]')){$tgts=$loader;}
		else{$tgts=$loader.find('[srcset]');}
		var x=window.devicePixelRatio;
		$loader.update=function(){
			$tgts.each(function(){
				var $tgt=$(this);
				var w=$tgt.width();
				var h=$tgt.height();
				$tgt.attr('srcset').split(',').some(function(src){
					src=src.trim().split(' ');
					if(src[1]){
						var n=parseInt(src[1].slice(0,-1));
						switch(src[1].substr(-1)){
							case 'w':if(n<w){return false;}else{break;}
							case 'h':if(n<h){return false;}else{break;}
							case 'x':if(n!=x){return false;}else{break;}
						}
					}
					$tgt.attr('src',src[0]);
					return true;						 
				});
			});
		};
		$loader.update();
		return $loader;
	},
	
	//テキストを１文字ずつspanに入れて連番のクラスを付与する
	cp_divide_text:function(cls,center){
		if(cls===undefined){cls='letter';}
		if(center===undefined){center=false;}
		$(this).each(function() {
			var txt=$(this).text();
			var l=txt.length;
			var rsl='';
			var i;
			if(center){
				for(i=0;i<l;i++){
					rsl+='<span class="'+cls+' '+cls+(i*2-l+1)+'">'+txt[i]+'</span>';
				}
			}
			else{
				for(i=0;i<l;i++){
					rsl+='<span class="'+cls+' '+cls+i+'">'+txt[i]+'</span>';
				}
			}
			$(this).html(rsl);
		});
	},
	//img要素に指定行列数で分割したdiv要素の集合を乗せる
	cp_divide_image:function(row,col,clsfunc){
		switch(clsfunc){
			case undefined:
			case 'normal':
				clsfunc=function(x,y){return x+y;};break;
			case 'reverse':
				clsfunc=function(x,y,col,row){return col+row-x-y-2;};break;
			case 'center':
				clsfunc=function(x,y,col,row){return Math.abs(col+row-2*(x+y+1));};break;
			case 'rand':
				clsfunc=function(){return Math.floor(Math.random()*10);};break;
		}
		$(this).each(function(){
			$(this).one('load',function(){
				var $img=$(this);
				var $wrap=$img.wrap('<div class="divide_image"></div>').parent();
				for(var y=0;y<row;y++){
					for(var x=0;x<col;x++){
						$img.clone().css({
							position:'absolute',
							width:col*100+'%',
							height:row*100+'%',
							top:-y*100+'%',
							left:-x*100+'%',
						}).wrap('<div class="piece piece'+clsfunc(x,y,col,row)+' col'+x+' row'+y+'"></div>').parent().css({
							position:'absolute',
							overflow:'hidden',
							width:100/col+'%',
							height:100/row+'%',
							top:y*100/row+'%',
							left:x*100/col+'%',
						}).appendTo($wrap);
					}
				}
				$wrap.css({position:'relative'});
				$img.css({width:'100%',height:'auto'}).addClass('original');
			}).load();
		});
	},
	
	//テキストの文字数に応じたクラスを付与
	cp_letter_length_class:function(thr){
		if(thr===undefined){thr=5;}
		$(this).each(function(){
			var l=$(this).text().length;
			for(var i=thr;i<l;i+=thr){$(this).addClass('gt'+i)}
		});
	},
	
	//子要素の数がしきい値に達するまでループ
	cp_loop_children:function(thr){
		$(this).each(function(){
			var $tgt=$(this);
			var $items=$tgt.children();
			if($items.length===0){return;}
			while($tgt.children().length<thr){
				$tgt.append($items.clone());
			}
		});
	},
	
	//thrのキー値を閾値、値をclassとしてclassを付加
	//thrがjQueryオブジェクトならば
	//オブジェクトが一部でも画面に入っている=visible
	//オブジェクト全体が画面に入っている＝appear
	//オブジェクトが画面を占有している=filled
	//オブジェクトが画面中央に入っている=active
	//オブジェクトが画面上部に入っている=lead
	//オブジェクト下部が画面下部より上にある=complete
	//オブジェクト上部が画面中央より上にある=actived
	//オブジェクトの中央が画面中央より下にある=below
	//オブジェクトの中央が画面中央より上にある=upper
	cp_scrollspy:function(thr){
		if(thr===undefined){
			$(this).each(function(){
				$(this).cp_scrollspy($(this));
			});
		}
		var $tgt=$(this);
		if(thr instanceof jQuery){
			var wh,wc,bnd,t,b,rmv,add;
			thr=thr.get(0);
			$(window).on('load resize',function(){
				wh=$(this).height();
				wc=wh/2;
			});
			$(window).on('load scroll',function(){
				bnd=thr.getBoundingClientRect();
				t=bnd.top;
				b=bnd.bottom;
				rmv='';
				add='scrollspy';	
				if(t<wh && b>0){
					add+=' visible';
					if(t>0 && b<wh){add+=' apear';}else{rmv+=' apear';}
					if(t<0 && b>wh){add+=' filled';}else{rmv+=' filled';}
					if(t<wc && b>wc){add+=' active';}else{rmv+=' active';}
				}else{
					rmv='visible apear filled active';
				}
				if(t<0 && b>0){add+=' lead';}else{rmv+=' lead';}
				if(b>wh){add+=' complete';}else{rmv+=' complete';}
				if(t<wc){add+=' actived';}else{rmv+=' actived';}
				if(t+b>wh){add+=' upper';rmv+=' below';}else{add+=' below';rmv+=' upper';}
				$tgt.addClass(add).removeClass(rmv);
			});
		}else{
			var crr=0;
			$(window).scroll(function(){
				var s=$(this).scrollTop();
				var n=0;
				for(var t in thr){
					if(s<t){break;}
					n=t;
				}
				if(crr!==n){
					$tgt.removeClass(thr[crr]).addClass(thr[n]);
					crr=n;
				}
			});
		}
		return this;
	},
		
	//スクロールの動作に応じてclassを付与する
	//top_end		画面上限に達している時
	//bottom_end	画面下限に達している時
	//rise			上に100px以上スクロール
	//fall			下に100px以下スクロール
	//move			500ms以上継続で合計の絶対値50px以上のスクロール
	//press			500ms以上継続で絶対値の合計50px以下のスクロール
	//shake			500ms以内に絶対値の合計50px以上で合計50px以下のスクロール
	//rised falled moved pressed shaked	
	cp_scroll_sensor:function(){
		var $window=$(window);
		var $tgt=$(this);
		var s,stop_count,scroll_count,start_s,prev_s,total,abs_total,bottom_end,touching;
		start_s=prev_s=$(window).scrollTop();
		stop_count=0;
		touching=false;
		$(window).on('touchstart',function(){touching=true;scroll_count=stop_count=0;});
		$(window).on('touchend',function(){touching=false;scroll_count=stop_count=0;});
		$(window).on('load resize',function(){
			bottom_end=$(document).height()-$(window).innerHeight()-10;
		});
		setInterval(function(){
			s=$window.scrollTop();
			abs_total+=Math.abs(s-prev_s);
			if(s===prev_s && !touching){stop_count++;}else{prev_s=s;stop_count=0;}
			if(stop_count>=5){
				start_s=prev_s=s;
				scroll_count=total=abs_total=0;
				$tgt.removeClass('rise fall move press shake');
			}
			else{
				total=s-start_s;
				if(scroll_count===10){
					if(abs_total<20){
						$tgt.removeClass('shake shaked').addClass('press pressed');
					}
					else if(Math.abs(total)<30){
						$tgt.removeClass('press pressed').addClass('shake shaked');
					}
					else{
						$tgt.removeClass('press pressed shake shaked');
					}
				}
				else if(scroll_count>10){
					$tgt.addClass('move moved');
				}
				if(total>10){
					$tgt.removeClass('fall falled').addClass('rise rised');
				}
				else if(total<-10){
					$tgt.removeClass('rise rised').addClass('fall falled');
				}
				if(s<3){$tgt.addClass('top_end');}
				else{$tgt.removeClass('top_end');}
				if(s>bottom_end){$tgt.addClass('bottom_end');}
				else{$tgt.removeClass('bottom_end');}
				scroll_count++;
			}
		},50);
	},
		
	
	//画面に対してのオブジェクトの位置を
	//真ん中に来た時を0として
	//進捗率を引数として関数を実行する
	cp_scrollcallback:function(fnc){
		$(this).each(function(){
			var $tgt=$(this);
			$tgt.cp_scrollprogress_callback=fnc;
			$(window).on('resize load',function(){$tgt.cp_scrollprogress_origin=$tgt.offset().top+$tgt.outerHeight()*0.5-$(this).height()*0.5;});
			$(window).on('scroll load',function(){$tgt.cp_scrollprogress_callback($(this).scrollTop()-$tgt.cp_scrollprogress_origin);});
		});
	},

	//click,touchendで$tgtにclsクラスを付加
	cp_toggle_class:function(cls,$tgt){
		if(!$tgt){$tgt=$(this).next();}
		if(!cls){cls='active';}
		$(this).on('click',function(){
			if($tgt.hasClass(cls)){$tgt.removeClass(cls);}else{$tgt.addClass(cls);}
		});
	},
	//click,touchendで$tgtのcls1,cls2のクラスを入れ替え
	cp_switch_class:function(cls1,cls2,$tgt){
		var $switcher=$(this);
		if(!$tgt){$tgt=$switcher;}
		else if(typeof($tgt)==='string'){$tgt=$($tgt);}
		$switcher.target=$tgt;
		if(!cls2){cls2='open';}
		if(!cls1){cls1='close';}
		$switcher.close=function(){$tgt.removeClass(cls2);$tgt.addClass(cls1);};
		$switcher.open=function(){$tgt.removeClass(cls1);$tgt.addClass(cls2);};
		$switcher.toggle=function(){
			if($tgt.hasClass(cls1)){$tgt.removeClass(cls1);$tgt.addClass(cls2);}
			else{$tgt.removeClass(cls2);$tgt.addClass(cls1);}
		};
		$switcher.on('click',$switcher.toggle);
		$switcher.close();
		return $switcher;
	},
		
	//click,touchendでクリックされた対象にのみclsクラスを付与し、それ以外からは削除する
	cp_relay_class:function(cls){
		if(cls===undefined){cls='active';}
		var $tgt=$(this);
		$(this).on('click',function(){
			if($(this).hasClass(cls)){$tgt.removeClass(cls);}
			else{$tgt.removeClass(cls);$(this).addClass(cls);}
		});
	},
		
	
	//子要素をクラス名(prev,next,thumb)に応じて$tgtにクラスを付加するコントロールにする
	//.tabの場合は自身が.thumbの役割を担う
	//$tgtが空なら親要素を$tgtとする
	//.thumbの子要素にdata-classがあればそのクラスを
	//.thumbにdata-class-prefixがあればその連番、なければsceneの連番を付与
	//.thumbの子要素にはactiveクラスが付加される
	//.prev .nextはそれぞれ最初と最後のクラスで.disableが付加される
	//最初のクラス付与までは$tgtに.initが付加される
	//prmにはautoplay,flickable,scrollableのフラグとinterval,waitを指定
	cp_class_control:function($tgt,prm){
		var conf,$thumb,$control,$images,$dots,crr;
		if(!$tgt){
			if($(this).length>1){
				$(this).each(function(){
					$(this).cp_class_control($tgt,prm);
				});
				return;
			}
			$tgt=$(this).parent();
		}
		$tgt.addClass('init');
		$control=this;
		var prm_default={
			loop:$(this).hasClass('loop'),//繰り返し
			autoplay:$(this).hasClass('autoplay'),//自動再生
			flickable:$(this).hasClass('flickable'),//左右のフリック・ドラッグによる操作の受付
			scrollable:$(this).hasClass('scrollable'),//画面のスクロールによる操作の受付
			stopbyhover:$(this).hasClass('stopbyhover'),//マウスオーバーで一時停止
			closable:$(this).hasClass('closable'),//閉じることができる
			loopItems:$(this).hasClass('loopItems'),//サムネールとアイテムを２回繰り返して配置
			initialSlide:0,//初期表示スライド
			interval:500,//シーン切り替え時の操作無効の時間
			wait:4500,//自動再生有効時のシーン切り替えまでの時間
		};
		conf=$(this).attr('data-config');
		if(conf){prm=$.extend(prm_default,JSON.parse(conf));}
		else{prm=prm_default;}
		crr=-1;
		if($(this).is('.tab')){$thumb=$(this);}
		else{$thumb=$(this).find('.thumb,.thumbnail');}
		$images=$tgt.find('.images,.contents').first();
		if($thumb.length===0){$thumb=$images;}
		$dots=$(this).find('.dots');
		if($dots.length){
			if($dots.children().length===0){$dots.append('<span class="dot"> </span>');}
			while($images.children().length > $dots.children().length){
				$dots.append($dots.children(':eq(0)').clone());
			}
			$dots.children().on('click',function(){$control.goto($dots.children().index(this));});
		}
		var $inc_tgt=$(this).add($tgt);
		var $prev=$(this).find('.prev');
		var $next=$(this).find('.next');
		var $close=$(this).find('.close');
		var closable=prm.closable || $close.length>0;
		var len=$thumb.children().length;
		var realLen=len;
		var max_n=prm.loopItems?len:Math.floor(len/2);
		var min_n=0-max_n;
		var in_interval=false;
		var by_scroll=false;
		var timer;
		$thumb.children().each(function(i){
			var cls=$(this).attr('data-class')?$(this).attr('data-class'):(($thumb.attr('data-class-prefix')?$thumb.attr('data-class-prefix'):'scene')+i);
			if(!$(this).attr('data-class')){$(this).attr('data-class',cls);}
		});
		if(prm.loopItems){
			$thumb.append($thumb.children().clone());
			if($thumb!==$images){$images.append($images.children().clone());}
			len=$thumb.children().length;
		}
		if(!$thumb.children('.active').length && $close.length===0){$thumb.children().eq(0).addClass('active');}
		$thumb.children().on('click',function(){
			if(closable && $(this).hasClass('active') && $tgt.hasClass('open')){$control.close();}
			else{$control.goto($thumb.children().index(this));}
		});
		$control.goto=function(to){
			this.open();
			if(prm.loop){to=(to+len)%len;}
			else{to=Math.min(Math.max(to,0),len-1);}
			if(to===crr){by_scroll=false;return false;}
			if(in_interval){by_scroll=false;return false;}
			in_interval=true;
			if(!prm.loop){
				if(to===0){$prev.addClass('disable');}
				else{$prev.removeClass('disable');}
				if(to===len-1){$next.addClass('disable');}
				else{$next.removeClass('disable');}
			}
			var $crr_thumb=$thumb.children().eq(crr);
			var $to_thumb=$thumb.children().eq(to);
			if($crr_thumb.attr('data-class')){
				$tgt.removeClass($crr_thumb.attr('data-class'));
			}
			else if($thumb.attr('data-class-prefix')){
				$tgt.removeClass($thumb.attr('data-class-prefix')+crr);
			}
			else{
				$tgt.removeClass('scene'+crr);
			}
			if($to_thumb.attr('data-class')){
				$tgt.addClass($to_thumb.attr('data-class'));
			}
			else if($thumb.attr('data-class-prefix')){
				$tgt.addClass($thumb.attr('data-class-prefix')+to);
			}
			else{
				$tgt.addClass('scene'+to);
			}
			$thumb.children().each(function(i){
				var cls;
				var n=i-to;
				var prev_n=i-crr;
				if(prm.loop){
					if(n>max_n){n-=len;}
					if(n<min_n){n+=len;}
					if(prev_n>max_n){prev_n-=len;}
					if(prev_n<min_n){prev_n+=len;}
				}
				if(n<0){cls='before';}
				else if(n>0){cls='after';}
				else{cls='active';}
				$(this).removeClass('thumb'+prev_n+' before after active').addClass(cls+' thumb'+n);
				if($images.length){
					$images.children(':eq('+i+')').removeClass('image'+prev_n+' before after active').addClass(cls+' image'+n);
				}
			});
			if($dots.length){
				$dots.children().removeClass('active').eq(to%realLen).addClass('active');
			}
			if(prm.scrollable && by_scroll===false){
				$('body,html').animate({scrollTop:($(document).height()-$(window).innerHeight())/len*(to+0.5)},500);
			}
			$('image0 img[data-src]',$images).each(function(){
				$(this).attr('src',$(this).attr('data-src'));
			});
			setTimeout(function(){in_interval=false;},prm.interval);
			crr=to;
			by_scroll=false;
		};
		$control.pause=function(){if(prm.autoplay){$control.stop();}};
		$control.resume=function(){if(prm.autoplay){$control.play();}};
		$control.stop=function(){if(timer){clearInterval(timer);}};
		$control.play=function(){$control.stop();timer=setInterval(function(){$control.next();},prm.interval+prm.wait);};
		$control.close=function(){
			$inc_tgt.addClass('close').removeClass('open');$control.pause();
		};
		$control.open=function(){
			$inc_tgt.removeClass('close').addClass('open');$control.resume();
		};
		$control.prev=function(){$control.goto(crr-1);};
		$control.next=function(){$control.goto(crr+1);};
		$prev.on('click touchend',$control.prev);
		$next.on('click touchend',$control.next);
		$close.on('click touchend',$control.close);
		if(prm.autoplay){
			$control.play();
		}
		if(prm.stopbyhover){
			$inc_tgt.mouseover($control.pause);
			$inc_tgt.mouseout($control.play);
		}
		if(prm.flickable){
			var org_x,is_flicking;
			$tgt.on('mousedown touchstart',function(e){
				if(e.type==='touchstart'){e=event.changedTouches[0];}
				is_flicking=true;
				org_x=e.clientX;
			});
			$('body').on('mouseup touchend',function(){is_flicking=false;});
			$tgt.on('mousemove touchmove',function(e){
				if(is_flicking){
					if(e.type==='touchmove'){e=event.changedTouches[0];}
					var s=e.clientX-org_x;
					if(s<-50){
						event.preventDefault();
						org_x=e.clientX;
						$control.goto(crr+1);
					}else if(s>50){
						event.preventDefault();
						org_x=e.clientX;
						$control.goto(crr-1);
					}
				}
			});
		}
		if(prm.scrollable){
			$(document).on('wheel,mousewheel,DOMMouseScroll,touchmove',function(e){if(in_interval){e.preventDefault();}});
			$(window).scroll(function(){
				by_scroll=true;
				$control.goto(Math.floor(len*$(window).scrollTop()/($(document).height()-$(window).innerHeight())));
			});
		}
		if(prm.initialSlide){$control.goto(prm.initialSlide);}
		else{$control.goto($thumb.children().index($thumb.children('.active')));}
		if(closable){$control.close();}
		setTimeout(function(){$tgt.removeClass('init');},1);
		return $control;
	},
	
	//ライトボックス
	cp_lightbox:function(){
		var $lightbox=$(this);
		var $container=$('#cp_lightbox.cp_lightbox_container');
		if($container.length===0){
			$container=$('<div id="cp_lightbox" class="cp_lightbox_container"><div class="cp_lightbox_content"></div></div>').appendTo('body');
		}
		var $content=$('.cp_lightbox_content',$container);
		var group=$content.children().length;
		var $group=$(
			'<div class="group" data-group="'+group+'">'+
			'<ul class="items"></ul>'+
			'<div class="control">'+
			'<div class="prev"></div>'+
			'<ul class="dots"></ul>'+
			'<div class="next"></div>'+
			'<div class="close"></div>'+
			'</div>'+
			'</div>'
		).appendTo($content);
		for(var n=0;n<$lightbox.length;n++){$('ul.dots').append('<li class="dot" data-index="'+n+'"></li>');}
		if($lightbox.length>2){$('ul.dots').addClass('active');}
		var $items=$('ul.items',$group);
		var $control=$('div.control',$group);
		var $dots=$('ul.dots li.dot',$control);
		$lightbox.goto=function(i){
			var $thumb;
			if($.isNumeric(i)){
				i=Math.max(0,Math.min(i,$lightbox.length-1));
				$thumb=$lightbox.eq(i);
			}
			else{$thumb=i;i=$lightbox.index(i);}
			var $item=$('li.item[data-index="'+i+'"]',$items);
			if($item.length===0){
				var $img;
				$item=$('<li class="item" data-index="'+i+'"></li>').appendTo($items);
				switch($thumb.attr('data-type')){
					case 'image':$img=$('<img/>').appendTo($item);break;
					case 'video':$img=$('<video/>').appendTo($item);break;
					case 'audio':$img=$('<audio/>').appendTo($item);break;
				}
				$img.attr('src',$thumb.attr('data-src'));
				$img.attr(JSON.parse($thumb.attr('data-attr')));
			}
			$lightbox.removeClass('active');
			$thumb.addClass('active');
			$container.addClass('active');
			$('ul.group',$content).removeClass('active');
			$group.addClass('active');
			$('li.item',$group).removeClass('active');
			$item.addClass('active');
			if(i==0){$('.prev',$control).removeClass('active');}
			else{$('.prev',$control).addClass('active');}
			if(i==$lightbox.length-1){$('.next',$control).removeClass('active');}
			else{$('.next',$control).addClass('active');}
			$dots.removeClass('active').eq(i).addClass('active');
		};
		$lightbox.close=function(){$container.removeClass('active');};
		$lightbox.prev=function(){$lightbox.goto($lightbox.index('.active')-1);};
		$lightbox.next=function(){$lightbox.goto($lightbox.index('.active')+1);};
		$lightbox.on('click',function(){$lightbox.goto($(this));});
		$content.on('click','.control .prev',function(){$lightbox.prev($(this));});
		$content.on('click','.control .next',function(){$lightbox.next($(this));});
		$content.on('click','.control .close',function(){$lightbox.close($(this));});
		$content.on('click','.control .dots .dot',function(){$lightbox.goto($(this).attr('data-index'));});
		return $lightbox;
	},
		
	//クリックで次要素をスライドダウン、自身にactiveクラスを付加、再度クリックで元に戻る
	cp_accordion:function(){
		$(this).css({cursor:'pointer'}).next().hide();
		$(this).click(function(){
			if($(this).hasClass('active')){
				$(this).next().slideUp();
				$(this).removeClass('active');
			}else{
				$(this).next().slideDown();
				$(this).addClass('active');
			}
		});
		return this;
	},
	//小要素にaccordionを適用、かつ一つ以上が開かれないようにする
	cp_accordion_group:function(){
		$(this).children(':even').each(function(){
			$(this).next().hide();
			$(this).click(
			function(){
				$(this).parent().children(':odd:visible').stop().slideUp();
				if($(this).hasClass('active')){
					$(this).next().stop().slideUp();
					$(this).parent().children(':even').removeClass('active');
				}else{
					$(this).next().stop().slideDown();
					$(this).parent().children(':even').removeClass('active');
					$(this).addClass('active');
				}
			});
		});
		return this;
	},
	//子要素クリックでターゲット（無指定なら次要素）の対応する子要素を表示切り替え、クリックされた子要素にactiveクラスを付加
	//あらかじめ子要素にactiveクラスを付加しておくと初期でそのタブを開きます
	cp_tab:function($tgt){
		var $self=$(this);
		if(!$tgt){$tgt=$(this).next();}
		$(this).children().each(function(i){
			$tgt.children().hide();
			$(this).click(function(){
				$tgt.children().hide();
				$tgt.children().eq(i).show();
				$self.children().removeClass('active');
				$(this).addClass('active');
				return false;
			});
		});
		if($(this).children('.active').length){
			$(this).children('.active').click();
		}else{
			$(this).children().eq(0).click();
		}
		return this;
	},
	//ハッシュリンクをスクロールにして、現在のスクロール位置に当たるリンクと対象要素にactiveクラスを付加する
	cp_hashscroll:function(mgn){
		mgn=mgn?mgn:0;
		var $hash_links=[];
		var s,prev_s;
		
		$(this).find("a[href^='#']").each(function(){
			var $hash_link=$(this);
			$hash_link.tgt=$(this.hash);
			$hash_link.click(function(){
				if($hash_link.tgt.length){
					$hash_link.tgt.trigger('expect');
					$('body,html').animate({scrollTop:$hash_link.tgt.offset().top-mgn},500);
				}
				else{
					$('body,html').animate({scrollTop:0},500);
				}
				return false;
			});
			$hash_links.push($hash_link);
		});
		setInterval(function(){
			s=$(window).scrollTop();
			if(s!==prev_s){
				$.each($hash_links,function($i,$hash_link){
					if($hash_link.tgt.length < 1){return;}
					var bnd=$hash_link.tgt.get(0).getBoundingClientRect();
					if(bnd.top<mgn && bnd.bottom>mgn){
						$hash_link.addClass('active');$hash_link.tgt.addClass('active');
					}
					else{$hash_link.removeClass('active');$hash_link.tgt.removeClass('active');}
				});
				prev_s=s;
			}
		},200);
		return this;
	},
	
	//郵便番号の入力から自動で都道府県と住所を入力
	//@todo httpsに対応する
	cp_zip_auto_fill:function($adr1,$adr2,$adr3){
		$(this).change(function(){
			jQuery.getJSON(
				'http://zipcloud.ibsnet.co.jp/api/search?callback=?',
				{zipcode:$(this).val()},
				function(data){
					if(data.status!==200){return;}
					if($adr3){
						$adr1.val(data.results[0].address1);
						$adr2.val(data.results[0].address2);
						$adr3.val(data.results[0].address3);
					}
					else if($adr2){
						$adr1.val(data.results[0].address1);
						$adr2.val(data.results[0].address2+data.results[0].address3);
					}
					else{
						$adr1.val(data.results[0].address1+data.results[0].address2+data.results[0].address3);
					}
				}
			);
		});
	},
	
	//GoogleMapAPIを利用して指定のオプションとマーカーでGoogleMapを描画する
	//api_key		GoogleAPIkey
	//mapOptions	new google.maps.Map()の第二引数とするオブジェクト
	//markers		geocoder.geocode()の第一引数とするオブジェクトの配列
	//markerOptions	new google.maps.Marker()の第一引数のデフォルト値
	cp_gmap:function(map_data){
		if(!('cp_gmap' in $.catpow)){
			$.catpow.cp_gmap={
				init:function(cb){
					if($.catpow.cp_gmap.loaded === false){
						if($.catpow.cp_gmap.loading === false){
							$.catpow.cp_gmap.loading=true;
							var dfr=new $.Deferred();
							$.catpow.cp_gmap.promise=dfr.promise();
							$.getScript('https://maps.googleapis.com/maps/api/js?key='+map_data['api_key'],function(){
								$.catpow.cp_gmap.loaded=true;
								$.catpow.cp_gmap.loading=false;
								$.catpow.cp_gmap.geocoder=new google.maps.Geocoder();
								dfr.resolve();
							});
						}
						$.catpow.cp_gmap.promise.done(cb);
					}
					else{cb();}
				},
				loaded:false,
				loading:false,
				geocoder:false,
				promise:false,
				datas:[]
			};
		}
		var tgt=this.get(0);
		if('id' in map_data){$.catpow.cp_gmap.datas[map_data.id]=map_data;}
		
		$.catpow.cp_gmap.init(function(){
			var map=new google.maps.Map(tgt,map_data.mapOptions);
			var mapBounds=false;
			$.each(map_data.markers,function(i,marker){
				var q={}
				if(marker['placeId']){q['placeId']=marker['placeId'];}
				else{q['address']=marker['address'];}
				$.catpow.cp_gmap.geocoder.geocode(q,function(results,status) { 
					if (status == google.maps.GeocoderStatus.OK) {
						marker['marker']=new google.maps.Marker(jQuery.extend(marker,map_data.markerOptions,{
							position:results[0].geometry.location,
							map:map
						}));
						if(mapBounds === false){
							map.setCenter(results[0].geometry.location);
							mapBounds=map.getBounds();
						}else{
							mapBounds.extend(results[0].geometry.location);
							map.fitBounds(mapBounds);
						}
					}else{
						console.log('Google Map failed to load geocode :'+status);
					}
				});
			});
		});
	},
	
	//フォームデータをjsonpで送信処理
	cp_ajax_submit:function(url,cb_fnc,cb_name){
		try{
			var $form=$(this);
			$form.trigger('cp_ajax_submit');
			var fd=new FormData($(this).get(0));
			if(!url){url=$(this).attr('action');}
			var prm={
				url:url,
				type:'post',
				dataType:'jsonp',
				data:fd,
				processData:false,
				contentType:false,
			};
			if(cb_name){prm.jsonpCallback=cb_name;}
			$.ajax(prm).done(function(res){
				if(cb_fnc){cb_fnc(res,$form);}
				$form.trigger('cp_ajax_callback',res);
			}).fail(function(e,ts,et){
				console.log('status:'+e.status);
				console.log(ts);
				console.log(et);
				if(e.status==='200'){
					console.log('data:');
					$.ajax({
						url:url,
						type:'post',
						dataType:'html',
						data:fd,
						processData:false,
						contentType:false,
					}).done(function(res){
						console.log(res);
					});
				}
			});
		}catch(e){
			console.log(e);
		}
	},
	cp_ajax_form:function(url,cb_fnc,cb_name){
		$(this).submit(function(){
			$(this).cp_ajax_submit(url,cb_fnc,cb_name);
			return false;
		});
	},
	
	//フォームの入力に応じて各種クラスと属性を付与する
	//チェックされたradioとcheckboxの対応するlabelにactiveクラスを付与
	//data-condで設定された条件を満たさないradio,checkboxにdisabled属性を付与
	//及び対応するlabelにdisabledクラスを付与	
	cp_form_conditioner:function(){
		var $form=$(this);
		$form.on('change','input[type="checkbox"]',function(){
			if($(this).is(':checked')){
				$(this).closest('label').addClass('active');
				$('label[for="'+$(this).attr('id')+'"]').addClass('active');
			}
			else{
				$(this).closest('label').removeClass('active');
				$('label[for="'+$(this).attr('id')+'"]').removeClass('active');
			}
		});
		$form.on('change','input[type="radio"]',function(){
			$form.find('input[name="'+$(this).attr('name')+'"]').each(function(){
				if($(this).is(':checked')){
					$(this).closest('label').addClass('active');
					$('label[for="'+$(this).attr('id')+'"]').addClass('active');
				}
				else{
					$(this).closest('label').removeClass('active');
					$('label[for="'+$(this).attr('id')+'"]').removeClass('active');
				}
			});
		});
		$('input:checked',$form).each(function(){
			$(this).closest('label').addClass('active');
			$('label[for="'+$(this).attr('id')+'"]').addClass('active');
		});
        $form.on('change','[data-input-range] input:checkbox',function(){
            var $cnt=$(this).closest('[data-input-range]');
            var r=$cnt.attr('data-input-range');
            if($cnt.find('input:checked:enabled').length > r){
                $(this).removeAttr('checked');
            }
        });
		
        /*
        入力とrefineの対象の関係をキャッシュする形式に書き直したい
		var refine_target={};
		var refine_target_vals={};
		var fnc_update_refine_target_data=function(){
			refine_target={};
			refine_target_vals={};
			$('[data-refine-cond]',$form).each(function(){
				var cond=$(this).attr('data-refine-cond');
				cond=JSON.parse(cond);
				for(var name in cond){
				}
			});
		};
        */
		var fnc_refine=function(){
			$('[data-refine-cond]',$form).each(function(){
				var cond=$(this).attr('data-refine-cond');
				if(!cond){return true;}
				var flg=true;
				cond=JSON.parse(cond);
				for(var name in cond){
					var sub_flg=false;
					for(var i=0,l=cond[name].length;i<l;i++){
						if($form.find('input[name^="'+name+'"][value="'+cond[name][i]+'"]:checked').length || $form.find('select[name^="'+name+'"]').val()===cond[name][i])
						{sub_flg=true;break;}
					}
					if(sub_flg===false){flg=false;break;}
				}
				if(flg){$(this).removeClass('disabled').find(':input').removeAttr('disabled');}
				else{$(this).addClass('disabled').find(':input').attr('disabled','disabled');}
			});
			$('[data-refine-cond].disabled [data-refine-cond]',$form).each(function(){
				$(this).addClass('disabled').find(':input').attr('disabled','disabled');
			});
		};
		$form.each(function(){$(this).get(0).addEventListener('change',fnc_refine,true);});
		$form.on('update',function(){
			fnc_refine();
			$('input:checked',$form).each(function(){
				$(this).closest('label').addClass('active');
				$('label[for="'+$(this).attr('id')+'"]').addClass('active');
			});
		});
		fnc_refine();
	},
    
	//リンクをポップアップにする
	cp_popup:function(w,h){
		w=(w===undefined?600:w);
		h=(h===undefined?400:h);
		$(this).click(function(){
			window.open($(this).attr('href'), "popup", "width="+w+",height="+h+",resizable=no,scrollbars=no");
			return false;
		});
		return this;
	},
    
    //親・兄弟要素の選択ができる要素検索
    //先頭でのみ有効、複数指定可、スペース区切り
    //以降のセレクタの起点となる
    //« closest
    //< parent
    //= siblings
    //- prev
    //+ next
    cp_find:function(sel){
        var i,fnc,fncs={'«':'closest','<':'parent','=':'siblings','-':'prev','+':'next'};
        var $org=$(this);
        while((fnc=fncs[sel[0]])!==undefined){
            $org=$org[fnc](sel.substr(1).split(' ',1)[0]);
            if((i=sel.indexOf(' '))!==-1){
                sel=sel.substr(i+1);
            }
            else{return $org;}
        }
        return $org.find(sel);
    },
	
	//対象の要素のバウンディングボックスの
	//位置とサイズを転写し続ける
    //表示・非表示、削除処理も共有する
	cp_cling:function($to){
        if(!('cp_cling' in $.catpow)){
            $.catpow.cp_cling={
                timer:setInterval(function(){
                    $.catpow.cp_cling.target.forEach(function(e,i){
                        if(e.cling_to.is(':visible')){
                            if(e.is(':hidden')){e.show();}
                            var bnd1=e.get(0).getBoundingClientRect();
                            var bnd2=e.cling_to.get(0).getBoundingClientRect();
                            if(
                                bnd1.width !== bnd2.width ||
                                bnd1.height !== bnd2.height ||
                                bnd1.left !== bnd2.left ||
                                bnd1.top !== bnd2.top
                            ){
                                var pos=e.position();
                                e.css({
                                    width:bnd2.width,
                                    height:bnd2.height,
                                    left:pos.left+bnd2.left-bnd1.left,
                                    top:pos.top+bnd2.top-bnd1.top,
                                });
                            }
                        }
                        else{
                            if(e.cling_to.is('body *')){e.hide();}
                            else{e.remove(); }
                        }
                        if(!e.is('body *')){delete ($.catpow.cp_cling.target[i]);}
                    });
                },30),
                target:[]
            };
        }
		if(typeof($to)==='string'){$to=$($to);}
        $(this).css({position:'absolute'});
        this.cling_to=$to;
        $.catpow.cp_cling.target.push(this);
        return this;
	},
	
	//自身と子孫要素の入力値からFormDataを取得
	//引数にFormDataが与えられた場合はそのFormDataに値を追加する
	cp_get_fd:function(fd){
		if(!fd){fd =new FormData();}
		var $inputs=$();
		$(this).each(function(){
			if($(this).is(':input')){$inputs=$inputs.add($(this));}
			else{$inputs=$inputs.add($(this).find(':input'));}
		});
        $inputs.each(function(){
			var $input=$(this);
            if($input.attr('disabled')){return;}
            if($input.is('input[type="file"]')){
                if($input.get(0).files[0]){fd.append($input.attr('name'),$input.get(0).files[0]);}
            }
            else if($input.is('input[type="checkbox"],input[type="radio"]')){
                if($input.is(':checked')){
                    fd.append($input.attr('name'),$input.val());
                }
            }
            else{
                fd.append($input.attr('name'),$input.val());
            }
        });
		return fd;
	},
	
	
});})(jQuery);
jQuery.catpow={};

//浮動小数点問題対策のmath
Math.sum=function(){
	var args=[],i;
	for(i=0;i<arguments.length;i++){
		args.push(arguments[i]);
	}
	i=args.reduce(function(i,n){
		var a=parseFloat(n).toString().split('.');
		if(a[1]){return Math.min(i,-a[1].length);}
		return i;
	},0);
	var n=args.reduce(function(a,v){
		return a+parseFloat(v+'e'+i*-1);
	},0);
	return parseFloat(n+'e'+i);
};
Math.pfloor=function(n,p){
	return parseFloat(Math.floor(parseFloat(n+'e'+p))+'e-'+p);
};
Math.pround=function(n,p){
	return parseFloat(Math.round(parseFloat(n+'e'+p))+'e-'+p);
};
Math.pceil=function(n,p){
	return parseFloat(Math.ceil(parseFloat(n+'e'+p))+'e-'+p);
};

