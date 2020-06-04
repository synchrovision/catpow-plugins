<?php
namespace Catpow;
do{
	if($attr['schedule']){
		$schedule=new util\schedule($attr['schedule']);
		if(!$schedule->includes('now')){break;}
	}
	if($attr['is_user_logged_in']==='-1' && is_user_logged_in()){break;}
	if($attr['is_user_logged_in']==='1' && !is_user_logged_in()){break;}
	if(!empty($attr['current_user_can'])){
		foreach(explode($attr['current_user_can']) as $cap){
			if($cap[0]==='!'){
				if(current_user_can(substr($cap,1))){break 2;}
				continue;
			}
			if(!current_user_can($cap)){break 2;}
		}
	}
	if($attr['input_value']){
		$cond=new util\cond($attr['input_value']);
		if(empty(form()) || $cond->test(form()->get_the_data())===false){break;}
	}
	echo $content;
}while(false);