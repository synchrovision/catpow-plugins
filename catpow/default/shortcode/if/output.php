<?php
namespace Catpow;
$atts=(array)$atts;
do{
	if(isset($atts['is_user_logged_in'])){
		if($prm['is_user_logged_in']==='false' || empty($prm['is_user_logged_in'])){
			if(is_user_logged_in()){break;}
		}
		elseif(!is_user_logged_in()){break;}
	}
	if(in_array('is_user_logged_in',$atts)){
		if(!is_user_logged_in()){break;}
	}
	if(isset($prm['current_user_can'])){
		if(current_user_can($prm['current_user_can'])){break;}
	}
	if(\cp::$content->form){
		$form=\cp::$content->form;
		if($cond=array_intersect_key($atts,$form->conf->meta)){
			$cond=array_map(function($val){return explode(',',$val);},$cond);
			foreach($cond as $key=>$vals){
				if(empty(array_intersect($vals,$form->inputs($form->the_data_path.'/'.$key)))){
					break 2;
				}
			}
		}
	}
	echo do_shortcode($content);
}while(false);
