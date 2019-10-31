function  cp_lazy_road(){
	jQuery(function($){
		$(window).scroll(function(){
			var scroll = $(window).scrollTop();
			var windowHeight = $(window).height();
			$(".i_box").each(function(i){
				if($("img",this).is(".dpy")){return;}
				var imgPos = $(this).offset().top;
				if (scroll > imgPos - windowHeight + windowHeight/5){
				   $("img",this).addClass("dpy");
					var jsonp=JSON.parse($(this).children().attr('data-url'));
				   $(this).find("img").attr("src",jsonp['thumb']);
				}
			});
		});
	});
}

function cp_light_box(){
	jQuery(function($){
		var nums=[];
		if($('.img_contents').length<1)return;
		var user_json=JSON.parse($('.img_contents').attr('data-user'));
		var $container = 
			$('<div class="l_box"><i class="fa fa-chevron-circle-left fa-2x prev" aria-hidden="true"></i><i class="fa fa-chevron-circle-right fa-2x next" aria-hidden="true"></i></div>').appendTo($('body'));
		$.each(user_json,function(i){
			$('.l_box').append('<div class="l_img '+i+'"></div>');
		});
		$('body').append('<div class="overlay"></div>')

		$container.goto=function($thumb){
			if($container.current == $thumb)return;
			var ac_img_id=$thumb.attr('id')+'-actual-image';
			$('.l_img').attr('id',ac_img_id);
			var jsonp=JSON.parse($thumb.children().attr('data-url'));
			if($.inArray(jsonp['num'], nums)==-1){
				$('.'+jsonp['user']).append('<img class="tgt'+jsonp['num']+'">');
				$('.tgt'+jsonp['num']).attr('src',jsonp['big']).attr('date-num',jsonp['num']).addClass('current');
				nums.push(jsonp['num']);
			}
			else{
				$('.tgt'+jsonp['num']).removeClass('disabled').addClass('current');
			}
			$('body').addClass('light_up');
			$container.current=$thumb;
		};
		$container.goto_prev=function(){
			$container.goto($container.current.prev());
		};
		$container.goto_next=function(){
			$container.goto($container.current.next());
		};	
		$('body').on('click','.i_box,.l_img,.overlay',function(){
			if(!$('body').hasClass('light_up')){	
				$container.goto($(this));
			}
			else{
				$('.current').addClass('disabled');
				$('.disabled').removeClass('current');
				$('body').removeClass('light_up');
			}
		});
		$('.l_box').on('click','.prev',function(){
			if(!$container.current.prev('.i_box').length)return;
			$('.current').addClass('disabled');
			$('.disabled').removeClass('current');
			$container.goto_prev();
		});
		$('.l_box').on('click','.next',function(){
			if(!$container.current.next('.i_box').length)return;
			$('.current').addClass('disabled');
			$('.disabled').removeClass('current');
			$container.goto_next();
		});
	});
}

	

