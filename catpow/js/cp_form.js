var cp=cp;

jQuery(function($){
	$.catpow.forms=[];
	$('form:has([name="_cp_form_nonce"])').each(function(){
		var $form=$(this);
		cp_form_init($form);
		$.catpow.forms.push($form);
	});
});
function cp_form_init($form){
    var $=jQuery;
    if($form.is('.cp_form')){$form.submit(function(){return false;});}
    $form.on('click','[data-role^="cp_form_submit_"]',function(){
        var param,$tgt;
        switch($(this).attr('data-role')){
            case "cp_form_submit_form":$tgt=$(this).closest('form');break;
            case "cp_form_submit_section":$tgt=$(this).closest('.cp_form_section');break;
            case "cp_form_submit_action":$tgt=$(this);break;
        }
        if(!$(this).attr('data-ignore-message') && $tgt.find('.message.task').length){
            $('html,body').animate({scrollTop:$tgt.find('.message.task').offset().top-100},500);
            throw 'Error message remain';
        }
        $('.cp_form_message .message',$(this).closest('form')).remove();
        if($(this).is('[data-param]')){param=JSON.parse($(this).attr('data-param'));}
        else{param=false;}
        cp_form_submit($tgt,$(this).attr('data-action'),$(this).attr('data-callback'),param);
    });
    $form.on('click','[data-role="cp_form_action_submit_group"] [data-param-value]',function(){
        var $cnt=$(this).closest('[data-role="cp_form_action_submit_group"]');
        var param={};
        param[$cnt.attr('data-param-key')]=$(this).attr('data-param-value');
        cp_form_submit($(this),$cnt.attr('data-action'),$cnt.attr('data-callback'),param);
    });
	
	$form.on('change',function(e){
		var changed_input_name=e.target.name;
		$('[data-watch]',$form).each(function(){
			var $watcher=$(this);
			$.each($watcher.attr('data-watch').split(','),function(i,target_name){
				if(changed_input_name.indexOf(target_name)===0){
					var callback,param;
					if($watcher.is('[data-param]')){param=JSON.parse($watcher.attr('data-param'));}else{param=false;}
					if($watcher.is('[data-callback]')){callback=$watcher.attr('data-callback');}else{callback='replace_item';}
					cp_form_submit($watcher,$watcher.attr('id'),callback,param);
				};
			});
		})
	});
    $form.cp_form_conditioner();
}

function cp_form_get_fd($item){
    var $=jQuery;
    var $form,$inputs,$smart_inputs,fd;
    if($item.is('form')){
        fd=new FormData($item.get(0));
    }
    else{
        $form=$item.closest('form');
        fd=new FormData();
        fd.append('action','cp_form');
        fd.append('_cp_form_nonce',$form.find('[name="_cp_form_nonce"]').val());
        fd.append('_wp_http_referer',$form.find('[name="_wp_http_referer"]').val());
        fd.append('cp_form_id',$form.find('[name="cp_form_id"]').val());
        if($item.is('.cp_form_section')){fd.append('cp_form_section_id',$item.attr('data-section-id'));}
        else{fd.append('cp_form_section_id',$item.closest('.cp_form_section').attr('data-section-id'));}
		$item.cp_get_fd(fd);
		if($item.is('[data-watch]')){
			var watch_targets=$item.attr('data-watch').split(',');
			watch_targets.map(function(name){$(':input[name^="'+name+'"]',$form).cp_get_fd(fd);});
		}
    }
    return fd;
}
function cp_form_submit($item,action,callback,param){
    var $=jQuery;
    var $form,fd;
    var dfr=new $.Deferred();
    try{
        if($item.is('form')){$form=$item;}
        else{$form=$item.closest('form');}
        fd=cp_form_get_fd($item);
        fd.append('action','cp_form');
        if(action){fd.append('cp_form_action',action);}
        if(param){$.each(param,function(key,val){fd.append(key,val);});}
        var prm={
            url:cp.ajax_url,
            type:'post',
            dataType:'jsonp',
            data:fd,
            processData:false,
            contentType:false,
        };
        $('body').addClass('busy_mode');
        $.ajax(prm).done(function(res){
            $('body').removeClass('busy_mode');
            console.log(res);
            var cbs;
            cbs={};
            if(res.callback){
                if(!Array.isArray(res.callback)){
                    res.callback=res.callback.split(',');
                }
                $.each(res.callback,function(i,cb){
                    //cbs[cb]=window[cb];
                    if(cb in $.catpow.cp_form.callback){
                        cbs[cb]=$.catpow.cp_form.callback[cb];
                    }
                    else{cbs[cb]=window[cb];}
                });
            }
            else if(callback){
                if(typeof callback === 'function'){cbs.callback=callback;}
                else{
                    if(!Array.isArray(callback)){callback=callback.split(',');}
                    $.each(callback,function(cbn,cb){
                        if(typeof cb === 'function'){cbs[cbn]=cb;}
                        else{
                            if(cb in $.catpow.cp_form.callback){
                                cbs[cb]=$.catpow.cp_form.callback[cb];
                            }
                            else{cbs[cb]=window[cb];}
                        }
                    });
                }
            }
            else{
                cbs.cp_form_update_results=window.cp_form_update_results;
            }
            $form.trigger('before_cp_form_callback',res);
            $.each(cbs,function(cbn,cb){
                if(cbn){$form.trigger(new $.Event('before_'+cbn));}
                cb($item,res);
                if(cbn){$form.trigger(new $.Event('after_'+cbn));}
            });
            $form.trigger('after_cp_form_callback',res);
            $form.cp_update();
            dfr.resolve();
        }).fail(function(e,ts,et){
            $('body').removeClass('busy_mode');
            console.log('status:'+e.status);
            console.log(ts);
            console.log(et);
            if(parseInt(e.status)===200){
                console.log('data:');
                $.ajax({
                    url:cp.ajax_url,
                    type:'post',
                    dataType:'html',
                    data:fd,
                    processData:false,
                    contentType:false,
                }).done(function(res){
                    console.log(res);
                });
            }
            dfr.reject();
        });
    }
	catch(e){
        console.log(e);
    }
    return dfr.promise();
}

(function($){
    $.catpow.cp_form={
        callback:{
            message:function($form,data){
                //console.log(data);
				var form_id;
				if(!$form.is('form,[data-role="cp_form_section"]')){$form=$form.closest('form,[data-role="cp_form_section"]');}
                if($form.is('form')){form_id=$form.attr('id');}
				else{form_id=$form.attr('data-section-id');}
				var $msgBox=$('[data-role="cp_form_message"][data-form-id="'+form_id+'"]',$form);
                if($msgBox.length===0){console.log('Messge Box for the form is not exists');return;}
				$msgBox.removeClass('has_task').children().remove();
                data.message.forEach(function(msg){
                    if(!msg.class){msg.class='';}
                    var $msg=$('<div class="message '+msg.class+'"><div class="text">'+msg.message+'</div></div>');
					$msg.appendTo($msgBox);
					if(msg.selector){
						var $tgt=$(msg.selector,$form);
						if($tgt.length===0){
							console.log('Invalid input "'+msg.selector+'" was not found in this form');
							console.log(msg.message);
							return;
						}
						$msg.addClass('has_target');
                    	$msg.appendTo($msgBox).cp_cling($tgt);
                    	$tgt.on('change',function(){$msg.cp_delay_remove();});
					}
                    if($msgBox.find('.task').length){$msgBox.addClass('has_task');}
                });
                //$('html,body').animate({scrollTop:$form.find('.message').offset().top-100},500);
                $form.trigger('update');
                return true;
            },
            
            replace:function($form,data){
                if(!$form.is('form')){$form=$form.closest('form');}
                $form.find('div.cp_form_content').html(data.html).trigger('replece');
                return $('html,body').animate({scrollTop:$form.offset().top-100},500).promise();
            },
            insert:function($item,data){
				var $form,$tgt;
                if($item.is('form')){$form=$item;}
				else{$form=$item.closest('form');}
				if(data.selector===undefined){$tgt=$item;}
				else{$tgt=$form.cp_find(data.selector);  }
				if($tgt.length===0){console.log(data.selector+'" was not found in this form');}
				if(data.position===undefined){data.position='before';}
				var $new=$tgt[data.position](data.html);
                return $('html,body').animate({scrollTop:$new.offset().top-100},500).promise();
            },
            update_inputs:function($form,data){
                if(!$form.is('form')){$form=$form.closest('form');}
                $('div[data-role="cp_form_inputs"]',$form).html(data.html).trigger('replace');
                return true;
            },
            update_results:function($form,data){
                if(!$form.is('form')){$form=$form.closest('form');}
                $('div[data-role="cp_form_results"]',$form).html(data.html).trigger('replace');
                return true;
            },
            update_nav:function($form,data){
                if(!$form.is('form')){$form=$form.closest('form');}
                $('div[data-role="cp_form_nav"]',$form).html(data.nav).trigger('replace');
                return true;
            },
            update_section:function($section,data){
                if(data.section_id){
                    var $form;
                    if(!$section.is('form')){$form=$section.closest('form');}
                    else{$form=$section;}
                    $section=$form.find('.cp_form_section[data-section-id="'+data.section_id+'"]');
                }
                $section.html(data.html).trigger('replace');
                return true;
            },
            replace_item:function($item,data){
                var $form;
                if($item.is('form')){$form=$item;}
                else{$form=$item.closest('form');}
                data.items.forEach(function(item){
                    var $tgt=$form.cp_find(item.selector);
                    if($tgt.length===0){
                        console.log(item.selector+'" was not found in this form');
                    }
					var $new=$(item.html);
                    $tgt.replaceWith($new);
					//$tgt.trigger('replace');
                });
                $form.trigger('update');
                return true;
            },
            remove_section:function($section,data){
                if(data.section_id){
                    var $form;
                    if(!$section.is('form')){$form=$section.closest('form');}
                    else{$form=$section;}
                    $section=$form.find('.cp_form_section[data-section-id="'+data.section_id+'"]');
                }
                $section.remove().trigger('replace');
                return true;
            },
            delay_replace:function($form,data){
                if(!$form.is('form')){$form=$form.closest('form');}
                $form.find('div.cp_form_content').cp_delay_replace(data.html);
                return $('html,body').animate({scrollTop:$form.offset().top-100},500).promise();
            },
            delay_update_inputs:function($form,data){
                if(!$form.is('form')){$form=$form.closest('form');}
                return $('div[data-role="cp_form_inputs"]',$form).cp_delay_replace(data.html);
            },
            delay_update_results:function($form,data){
                if(!$form.is('form')){$form=$form.closest('form');}
                return $('div[data-role="cp_form_results"]',$form).cp_delay_replace(data.html);
            },
            delay_update_section:function($section,data){
                return $section.cp_delay_replace(data.html);
            },
            delay_replace_item:function($form,data){
                if(!$form.is('form')){$form=$form.closest('form');}
                var dfr=new $.Deferred();
                var cnt=0;
                data.items.forEach(function(item){
                    var $tgt=$form.find(item.selector).closest('.cp-meta-item');
                    if($tgt.length===0){
                        console.log('Item to replace "'+item.selector+'" was not found in this form');
                    }
                    cnt++;
                    $tgt.cp_delay_replace(item.html).done(function(){
                        cnt--;
                        if(cnt<1){dfr.resolve();}
                    });
                });
                return dfr.promise();
            },
            delay_remove_section:function($section,data){
                if(data.section_id){
                    var $form;
                    if(!$section.is('form')){$form=$section.closest('form');}
                    else{$form=$section;}
                    $section=$form.find('.cp_form_section[data-section-id="'+data.section_id+'"]');
                }
                return $section.cp_delay_remove();
            },
            lightbox:function($item,data){
                var $cnt=$item.find('.cp_lightbox_container');
                var dfr=new $.Deferred();
                if($cnt.length===0){$cnt=$('<div class="cp_lightbox_container"><div class="cp_lightbox_content"></div></div>').appendTo($item);}
                $cnt.find('.cp_lightbox_content').html(data.html).trigger('replace');
                setTimeout(function(){$cnt.cp_activate();},1);
                setTimeout(function(){dfr.resolve();},1000);
                return dfr.promise();
            },
            lightbox_close:function($item){
                var $cnt=$item.find('.cp_lightbox_container');
                var dfr=new $.Deferred();
                $cnt.cp_inactivate();
                setTimeout(function(){$cnt.find('.cp_lightbox_content').html('');dfr.resolve();},1000);
                return dfr.promise();
            },
            exlightbox:function($item,data){
                var $cnt=$('#cp_exlightbox.cp_lightbox_container');
                var dfr=new $.Deferred();
                if($cnt.length===0){
                    $cnt=$('<div id="cp_exlightbox" class="cp_lightbox_container"><div class="cp_lightbox_content"></div></div>').appendTo('.site_main .page_main .content');
                }
                $cnt.find('.cp_lightbox_content').html(data.html).trigger('replace');
                setTimeout(function(){$cnt.cp_activate();},1);
                setTimeout(function(){dfr.resolve();},1000);
                return dfr.promise();
            },
            exlightbox_close:function(){
                var dfr=new $.Deferred();
                $('#cp_exlightbox.cp_lightbox_container').cp_inactivate();
                setTimeout(function(){dfr.resolve();},1000);
                return dfr.promise();
            },
            insert_html:function($item,data){
                var $form;
                if($item.is('form')){$form=$item;}
                else{$form=$item.closest('form');}
                var $tgt;
                if(data.selector===undefined){$tgt=$item;}
                else{$tgt=$item.cp_find(data.selector);}
                if($tgt.length===0){
                    console.log(data.selector+'" was not found in this form');
                }
                if(data.position===undefined){data.position='append';}
                $tgt[data.position](data.html);
                $item.closest('.cp_form').trigger('update');
                return true;
            },
            insert_items:function($item,data){
                var $form;
                if($item.is('form')){$form=$item;}
                else{$form=$item.closest('form');}
                var $tgt;
                data.items.forEach(function(item){
                    if(item.selector===undefined){$tgt=$item;}
                    else{
                        $tgt=$item.cp_find(item.selector);
                    }
                    if($tgt.length===0){
                        console.log(item.selector+'" was not found in this form');
                    }
                    if(item.postion===undefined){item.postion='before';}
                    $tgt[item.postion](item.html);
                });
                $form.trigger('update');
                return true;
            },
            section_message:function($sec,data){
                console.log(data);
                if(!$sec.is('.cp_form_section')){$sec=$sec.closest('.cp_form_section');}
                var $tgt=$sec.find('.cp_form_section_message').not($sec.find('.cp_form_section .cp_form_section_message'));
                data.message.forEach(function(msg){
                    $tgt.find('.message').remove();
                    if(!msg.class){msg.class='';}
                    $tgt.append('<div class="message '+msg.class+'">'+msg.message+'</div>');
                });
                $sec.trigger('update');
                return true;
            },
            feed:function($form,data){
                if(!$form.is('form')){$form=$form.closest('form');}
                data.message.forEach(function(msg){
                    $form.find(msg.selector).addClass('has_message '+msg.class).after('<span class="message '+msg.class+'">'+msg.message+'</span>');
                });
                $form.trigger('update');
                return true;
            },
            redirect:function($form,data){
                location.href=data.url;
                return true;
            },
            reload:function(){
                location.reload();
                return true;
            },
            download:function($form,data){
                var blob=new Blob([data.html],{type:data.type||'text/plain'});
                var url = window.URL || window.webkitURL;
                var blobURL = url.createObjectURL(blob);

                var a = document.createElement('a');
                a.download = data.name||'undefined.txt';
                a.href = blobURL;
                a.click();
                a.remove();
                return true;
            },

            submit_again:function($item,data){
                var prm;
                if(data.submit===undefined){prm={delay:1000,action:'action'};}
                else{prm=data.submit;}
                if(prm.delay===undefined){
                    return cp_form_submit($item,prm.action,prm.callback,prm.param);
                }
                else{
                    var dfr=new $.Deferred();
                    setTimeout(function(){
                        cp_form_submit($item,prm.action,prm.callback,prm.param).done(function(){
                            dfr.resolve();
                        });
                    },prm.delay);
                    return dfr.promise();
                }
            },

            ticker:function($item,data){
                var fd,prm,dfr;
                dfr=new $.Deferred();
                fd=cp_form_get_fd($item);
                fd.append('cp_thread[path]',data.thread.path);
                fd.append('cp_thread[id]',data.tread.id);
                $item.on('change',function(){
                    fd=cp_form_get_fd($item);
                    fd.append('cp_thread[path]',data.thread.path);
                    fd.append('cp_thread[id]',data.tread.id);
                });
                if(data.timer===undefined){prm={interval:500};}
                else{prm=data.timer;}
                if(prm.interval===undefined){prm.interval=500;}
                var tick=function(){
                    $.ajax({
                        url:cp.plugins_url+'/catpow/callee/cp_form_tick.php',
                        type:'post',
                        dataType:'json',
                        data:fd,
                        processData:false,
                        contentType:false,
                    }).done(function(res){
                        if(res.callback){
                            try{
                                var rtn;
                                if(res.callback in $.catpow.cp_form.callback){
                                    rtn=$.catpow.cp_form.callback[res.callback]($item,res);
                                }
                                else{rtn=window[res.callback]($item,res);}
                                if(typeof rtn==='object'){
                                    rtn.done(function(){
                                        setTimeout(tick,prm.interval);
                                    });
                                }
                                else if(rtn===true){
                                    setTimeout(tick,prm.interval);
                                }
                            }
                            catch(e){console.log(e);dfr.reject();}
                        }
                        else{setTimeout(tick,prm.interval);}
                    }).fail(function(e,ts,et){
                        console.log('status:'+e.status);
                        console.log(ts);
                        console.log(et);
                        if(parseInt(e.status)===200){
                            console.log('data:');
                            $.ajax({
                                url:cp.plugins_url+'/catpow/callee/cp_form_tick.php',
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
                };
                setTimeout(tick,prm.interval);
                return dfr.promise();
            },
            
            return_true:function(){
                return true;
            },
            return_false:function(){
                return false;
            },
            wait:function($item,data){
                var dfr=new $.Deferred();
                setTimeout(function(){dfr.resolve();},data.wait || 2000);
                return dfr.promise();
            }
        }
    };
})(jQuery);
